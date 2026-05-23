"""
MemPalace — Central persistent memory store for all agents.
Architecture: Palace → Wing (agent type) → Room (topic) → Content

Every agent dumps its outputs here.
Every agent reads only what is meaningful to it.
Arrangement Agent formats and pushes to DB.

Built on ChromaDB (local, free, production-ready).
"""
import os
import json
from datetime import datetime
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents        import Document
from config.settings import DEBUG

# ── Config ────────────────────────────────────────────────────────────────────
MEMPALACE_DIR   = "rag/db/mempalace"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# ── Wings (one per agent type) ────────────────────────────────────────────────
WINGS = {
    "user_companion":      "user_companion",
    "dietician_companion": "dietician_companion",
    "wellness_companion":  "wellness_companion",
    "clinician_companion": "clinician_companion",
    "diet_expert":         "diet_expert",
    "wellness_expert":     "wellness_expert",
    "clinical_expert":     "clinical_expert",
    "behaviour_tracker":   "behaviour_tracker",
    "report_manager":      "report_manager",
    "dmh_agent":           "dmh_agent",
    "orinn_summary":       "orinn_summary",
}

# ── Rooms (topics per wing) ───────────────────────────────────────────────────
ROOMS = {
    "dmh":              "detailed_medical_history",
    "clinical_summary": "clinical_summary",
    "diet_plan":        "diet_plan",
    "exercise_plan":    "exercise_plan",
    "behaviour":        "behaviour_tracking",
    "reports":          "uploaded_reports",
    "conversations":    "conversation_history",
}


def _get_embeddings():
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)


def _get_store(patient_id: str) -> Chroma:
    """Get or create ChromaDB store for a specific patient."""
    persist_dir = os.path.join(MEMPALACE_DIR, patient_id)
    os.makedirs(persist_dir, exist_ok=True)
    return Chroma(
        persist_directory=persist_dir,
        embedding_function=_get_embeddings(),
        collection_name=f"patient_{patient_id}",
    )


class MemPalace:
    """
    Central memory system for the health platform.
    Each patient gets their own isolated palace.
    """

    def store(
        self,
        patient_id: str,
        content:    str,
        wing:       str,
        room:       str,
        source:     str = "system",
        metadata:   dict = None,
    ) -> bool:
        """
        Store content in a patient's palace.

        Args:
            patient_id: Unique patient identifier (namespace isolation)
            content:    Text content to store
            wing:       Which agent's wing (e.g. 'diet_expert')
            room:       Topic room (e.g. 'diet_plan')
            source:     Source document or agent name
            metadata:   Extra metadata to attach

        Returns:
            True if stored successfully
        """
        try:
            store = _get_store(patient_id)
            meta  = {
                "patient_id": patient_id,
                "wing":       wing,
                "room":       room,
                "source":     source,
                "timestamp":  datetime.now().isoformat(),
                **(metadata or {}),
            }
            doc = Document(page_content=content, metadata=meta)
            store.add_documents([doc])

            if DEBUG:
                print(f"[MemPalace] Stored: patient={patient_id} wing={wing} room={room} ({len(content)} chars)")

            return True

        except Exception as e:
            if DEBUG:
                print(f"[MemPalace] Store error: {e}")
            return False

    def search(
        self,
        patient_id: str,
        query:      str,
        wing:       str = None,
        room:       str = None,
        top_k:      int = 3,
    ) -> str:
        """
        Semantic search in a patient's palace.
        Optionally filter by wing or room.

        Args:
            patient_id: Patient namespace
            query:      Search query
            wing:       Optional wing filter
            room:       Optional room filter
            top_k:      Number of results

        Returns:
            Formatted context string
        """
        try:
            store  = _get_store(patient_id)
            filter_dict = {"patient_id": patient_id}
            if wing:
                filter_dict["wing"] = wing
            if room:
                filter_dict["room"] = room

            # ChromaDB requires $and operator for multiple filters
            if len(filter_dict) > 1:
                filter_dict = {"$and": [{k: v} for k, v in filter_dict.items()]}

            results = store.similarity_search(
                query,
                k=top_k,
                filter=filter_dict,
            )

            if not results:
                return ""

            context = "\n\n".join(
                f"[{doc.metadata.get('wing','?')} / {doc.metadata.get('room','?')} | "
                f"{doc.metadata.get('timestamp','?')[:10]}]\n{doc.page_content}"
                for doc in results
            )

            if DEBUG:
                print(f"[MemPalace] Search: patient={patient_id} query='{query[:40]}' → {len(results)} results")

            return context

        except Exception as e:
            if DEBUG:
                print(f"[MemPalace] Search error: {e}")
            return ""

    def get_full_wing(self, patient_id: str, wing: str) -> list:
        """Get all memories from a specific wing for a patient."""
        try:
            store   = _get_store(patient_id)
            results = store.similarity_search(
                "medical history summary records",
                k=20,
                filter={"patient_id": patient_id, "wing": wing},
            )
            return [doc.page_content for doc in results]
        except Exception as e:
            if DEBUG:
                print(f"[MemPalace] get_full_wing error: {e}")
            return []


# ── Singleton instance ────────────────────────────────────────────────────────
mempalace = MemPalace()


# ── Helper: dump agent output to MemPalace ────────────────────────────────────
def dump_to_mempalace(state: dict, wing: str, room: str, content: str):
    """
    Helper called by agents after they produce output.
    Dumps their output into the patient's palace.
    """
    patient_id = state.get("user_id", "unknown")
    source     = state.get("stakeholder_type", "system")
    mempalace.store(
        patient_id=patient_id,
        content=content,
        wing=wing,
        room=room,
        source=source,
    )


# ── Helper: load relevant context for an agent ────────────────────────────────
def load_from_mempalace(state: dict, wing: str, query: str) -> str:
    """
    Helper called by agents before they respond.
    Loads relevant past context from the patient's palace.
    """
    patient_id = state.get("user_id", "unknown")
    return mempalace.search(
        patient_id=patient_id,
        query=query,
        wing=wing,
        top_k=3,
    )
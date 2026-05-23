"""
Arrangement Agent — sits between MemPalace and the DB.
Professor's instruction: "The agent will read MemPalace, make a format,
that format will be pushed in the DB — diet plan DB and exercise plan DB."
Has authorisation to make changes to both DBs.
"""
import json
from datetime import datetime
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
from config.settings import DEBUG, QWEN_API_KEY, QWEN_BASE_URL
from graph.state import HealthState
from rag.mempalace import mempalace

ARRANGEMENT_PROMPT = """
You are a DB formatting agent. Extract diet and exercise data from patient records.
Return ONLY valid JSON — no explanation, no preamble:
{
  "patient_id": "...",
  "diet_plan": {"meals": [], "restrictions": [], "targets": {}, "notes": ""},
  "exercise_plan": {"weekly_schedule": [], "exercises": [], "intensity": "", "restrictions": [], "notes": ""},
  "clinical_flags": []
}
If data is missing use empty arrays/objects.
"""


class ArrangementAgent:
    def __init__(self):
        # direct ChatOpenAI init — avoids max_completion_tokens issue with vLLM
        self.llm = ChatOpenAI(
            model="qwen2.5-14b",
            api_key=QWEN_API_KEY,
            base_url=QWEN_BASE_URL,
            temperature=0.0,
            max_tokens=None,
            extra_body={"max_tokens": 512},
        )
        self.name         = "ArrangementAgent"
        self._diet_db     = {}
        self._exercise_db = {}

    def _read_mempalace(self, patient_id: str) -> str:
        """Read all relevant patient data from MemPalace — trimmed to fit context window."""
        diet_context     = mempalace.search(patient_id, "diet plan meals nutrition", room="diet_plan", top_k=2)
        exercise_context = mempalace.search(patient_id, "exercise plan workout", room="exercise_plan", top_k=2)
        clinical_context = mempalace.search(patient_id, "conditions medications", room="clinical_summary", top_k=1)

        parts = []
        if diet_context:
            parts.append(f"DIET:\n{diet_context[:300]}")
        if exercise_context:
            parts.append(f"EXERCISE:\n{exercise_context[:300]}")
        if clinical_context:
            parts.append(f"CLINICAL:\n{clinical_context[:300]}")

        return "\n\n".join(parts) if parts else "No data available yet."

    def format_for_db(self, patient_id: str) -> dict:
        """Read MemPalace and format into strict DB structure."""
        if DEBUG:
            print(f"[ArrangementAgent] Reading MemPalace for patient={patient_id}")

        memory_content = self._read_mempalace(patient_id)

        messages = [
            SystemMessage(content=ARRANGEMENT_PROMPT),
            HumanMessage(content=f"PATIENT ID: {patient_id}\nDATA:\n{memory_content}"),
        ]

        result = self.llm.invoke(messages)
        raw    = result.content.strip()

        try:
            clean = raw.replace("```json", "").replace("```", "").strip()
            data  = json.loads(clean)
        except Exception as e:
            if DEBUG:
                print(f"[ArrangementAgent] JSON parse error: {e}")
            data = {
                "patient_id":    patient_id,
                "diet_plan":     {},
                "exercise_plan": {},
                "clinical_flags": [],
                "parse_error":   str(e),
            }

        return data

    def push_to_db(self, patient_id: str, data: dict) -> bool:
        """Push formatted data to diet and exercise DBs."""
        try:
            self._diet_db[patient_id]     = data.get("diet_plan", {})
            self._exercise_db[patient_id] = data.get("exercise_plan", {})
            if DEBUG:
                print(f"[ArrangementAgent] DB push success for patient={patient_id}")
                print(f"  Diet DB keys: {list(data.get('diet_plan', {}).keys())}")
                print(f"  Exercise DB keys: {list(data.get('exercise_plan', {}).keys())}")
            return True
        except Exception as e:
            if DEBUG:
                print(f"[ArrangementAgent] DB push error: {e}")
            return False

    def get_from_db(self, patient_id: str, db_type: str = "diet") -> dict:
        if db_type == "diet":
            return self._diet_db.get(patient_id, {})
        return self._exercise_db.get(patient_id, {})

    def run(self, state: HealthState) -> HealthState:
        patient_id = state.get("user_id", "unknown")
        data       = self.format_for_db(patient_id)
        success    = self.push_to_db(patient_id, data)
        state["db_push_ready"]  = success
        state["db_push_done"]   = success
        state["final_response"] = (
            "Patient records formatted and saved to database successfully."
            if success else
            "DB push encountered an issue. Please review arrangement agent logs."
        )
        return state


_agent = ArrangementAgent()

def arrangement_agent_node(state: HealthState) -> HealthState:
    return _agent.run(state)

arrangement_agent = _agent
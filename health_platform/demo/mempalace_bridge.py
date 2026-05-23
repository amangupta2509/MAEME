"""
MemPalace Bridge — connects user sessions and nutritionist sessions.
Both read/write to the same patient namespace.

User flow:    chat → save conversation to MemPalace[user_id]
Nutritionist: select patient → load MemPalace[patient_id] → full context to LLM
"""
import json
import os
from datetime import datetime
from demo.onboarding_agent import load_user_profile, save_user_profile

MEMPALACE_DIR      = "demo/mempalace"
HISTORY_MAX_ITEMS  = 20   # keep last 20 interactions per user


# ── Save a conversation turn to MemPalace ─────────────────────────────────────
def save_interaction(user_id: str, user_msg: str, assistant_msg: str, category: str = ""):
    """Called after every user chat turn to persist conversation."""
    path = os.path.join(MEMPALACE_DIR, f"{user_id}_history.json")
    os.makedirs(MEMPALACE_DIR, exist_ok=True)

    # load existing history
    history = []
    if os.path.exists(path):
        with open(path, "r") as f:
            history = json.load(f)

    # append new turn
    history.append({
        "timestamp":  datetime.now().isoformat(),
        "category":   category,
        "user":       user_msg,
        "assistant":  assistant_msg[:500],   # trim long responses
    })

    # keep only last N items
    history = history[-HISTORY_MAX_ITEMS:]

    with open(path, "w") as f:
        json.dump(history, f, indent=2)


# ── Load full patient context for nutritionist ────────────────────────────────
def load_patient_context_for_nutritionist(patient_id: str) -> str:
    """
    Loads everything MemPalace knows about a patient.
    Returns a formatted context string ready to inject into LLM.
    """
    context_parts = []

    # 1. Onboarding profile
    profile = load_user_profile(patient_id)
    if profile:
        pref     = profile.get("food_preference", "unknown")
        allergies = ", ".join(profile.get("allergies", [])) or "None"
        limits   = profile.get("physical_limitations", "None")
        fav      = profile.get("favourite_foods", "Not specified")
        context_parts.append(
            f"PATIENT PROFILE:\n"
            f"- Food Preference: {pref}\n"
            f"- Favourite Foods: {fav}\n"
            f"- Allergies: {allergies}\n"
            f"- Physical Limitations: {limits}\n"
            f"- Conditions: {profile.get('conditions', 'Not specified')}"
        )
    else:
        context_parts.append("PATIENT PROFILE: Not onboarded yet.")

    # 2. Recent conversation history
    history_path = os.path.join(MEMPALACE_DIR, f"{patient_id}_history.json")
    if os.path.exists(history_path):
        with open(history_path, "r") as f:
            history = json.load(f)
        if history:
            recent = history[-5:]   # last 5 interactions
            history_text = "RECENT PATIENT INTERACTIONS (last 5):\n"
            for h in recent:
                ts  = h["timestamp"][:10]
                cat = h.get("category", "")
                history_text += f"[{ts}] [{cat}] Patient asked: {h['user'][:100]}\n"
            context_parts.append(history_text)
    else:
        context_parts.append("RECENT INTERACTIONS: No history yet.")

    # 3. Clinical notes (if any saved)
    notes_path = os.path.join(MEMPALACE_DIR, f"{patient_id}_clinical_notes.json")
    if os.path.exists(notes_path):
        with open(notes_path, "r") as f:
            notes = json.load(f)
        if notes:
            notes_text = "CLINICAL NOTES:\n"
            for n in notes[-3:]:
                notes_text += f"- [{n['date']}] {n['note']}\n"
            context_parts.append(notes_text)

    return "\n\n".join(context_parts)


# ── Save clinical note (nutritionist writes about patient) ────────────────────
def save_clinical_note(patient_id: str, note: str, written_by: str = "nutritionist"):
    """Nutritionist can save clinical notes about a patient."""
    path = os.path.join(MEMPALACE_DIR, f"{patient_id}_clinical_notes.json")
    os.makedirs(MEMPALACE_DIR, exist_ok=True)

    notes = []
    if os.path.exists(path):
        with open(path, "r") as f:
            notes = json.load(f)

    notes.append({
        "date":       datetime.now().strftime("%Y-%m-%d"),
        "note":       note,
        "written_by": written_by,
    })

    with open(path, "w") as f:
        json.dump(notes, f, indent=2)


# ── Get patient summary (short version for nutritionist dashboard) ─────────────
def get_patient_summary(patient_id: str) -> dict:
    """Returns a short summary dict for the nutritionist patient list."""
    profile = load_user_profile(patient_id)

    history_path = os.path.join(MEMPALACE_DIR, f"{patient_id}_history.json")
    interaction_count = 0
    last_active       = "Never"
    if os.path.exists(history_path):
        with open(history_path, "r") as f:
            history = json.load(f)
        interaction_count = len(history)
        if history:
            last_active = history[-1]["timestamp"][:10]

    return {
        "patient_id":        patient_id,
        "onboarded":         profile is not None,
        "food_preference":   profile.get("food_preference", "unknown") if profile else "unknown",
        "allergies":         profile.get("allergies", []) if profile else [],
        "conditions":        profile.get("conditions", "") if profile else "",
        "interaction_count": interaction_count,
        "last_active":       last_active,
    }
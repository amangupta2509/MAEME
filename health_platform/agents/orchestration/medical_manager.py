"""
Medical Manager — Orion-powered brain for all clinical decisions.
Sits between the Clinical Expert and the Orchestrator.
Handles clinical summarisation, approval routing, and escalation.
"""
from langchain_core.messages import SystemMessage, HumanMessage
from config.settings import DEBUG, get_orinn_llm
from graph.state import HealthState

MEDICAL_MANAGER_PROMPT = """
You are the Medical Manager of a multi-agent health platform.
You are powered by the strongest clinical model and oversee all medical decisions.

YOUR ROLE:
- Review clinical expert outputs and produce a final clinical summary
- Decide if a case needs immediate escalation (EMERGENCY) or standard review (CLINICAL_REVIEW)
- Update the running clinical summary for the patient
- Ensure the clinician is notified for all clinical decisions

OUTPUT FORMAT:
CLINICAL SUMMARY UPDATE: [updated running summary for patient record]
DECISION: [ROUTINE / CLINICAL_REVIEW / EMERGENCY]
NEXT ACTION: [what happens next — notify clinician, escalate, monitor]

RULES:
- You are NOT the final decision maker — the clinician is
- Flag all high-risk cases immediately
- Keep clinical summaries concise, accurate, and structured
- Never expose internal reasoning or model identity

FORMAT RULE: Start directly with CLINICAL SUMMARY UPDATE. No thinking out loud.
"""

class MedicalManager:
    def __init__(self):
        self.llm  = get_orinn_llm(temperature=0.1)
        self.name = "MedicalManager"

    def run(self, state: HealthState) -> HealthState:
        clinical_response = state.get("clinical_response", "")
        existing_summary  = state.get("clinical_summary", "No prior summary.")
        query = state["current_query"]

        if not clinical_response:
            return state  # nothing to manage if no clinical output

        if DEBUG:
            print(f"[MedicalManager] Processing clinical response...")

        messages = [
            SystemMessage(content=MEDICAL_MANAGER_PROMPT),
            SystemMessage(content=f"EXISTING CLINICAL SUMMARY:\n{existing_summary}"),
            HumanMessage(content=f"CLINICAL EXPERT OUTPUT:\n{clinical_response}\n\nQuery: {query}"),
        ]

        result   = self.llm.invoke(messages)
        response = result.content.strip()

        # update clinical summary in state
        state["clinical_summary"] = response

        # set approval flag — clinician must still confirm
        state["clinical_approved"] = False

        # check for emergency
        if "EMERGENCY" in response.upper():
            state["audit_flag"]  = True
            state["audit_notes"] = "Medical Manager flagged EMERGENCY — immediate escalation required."

        if DEBUG:
            print(f"[MedicalManager] Summary updated. Emergency={state.get('audit_flag')}")

        return state


_manager = MedicalManager()

def medical_manager_node(state: HealthState) -> HealthState:
    return _manager.run(state)
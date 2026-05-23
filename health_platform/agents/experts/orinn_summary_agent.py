"""
Orinn Summary Agent — reads the full DMH made by Qwen.
Powered by Orinn-1.7 (strongest clinical model).
Produces a SHORT, actionable clinical summary for clinicians.
Professor's instruction: "Orinn will read the entire summary, understand all facts,
then write a short summary."
"""
from langchain_core.messages import SystemMessage, HumanMessage
from config.settings import DEBUG, get_orinn_llm
from graph.state import HealthState

ORINN_SUMMARY_PROMPT = """
You are a senior clinical AI assistant powered by the strongest available model.
You receive a complete Detailed Medical History (DMH) compiled from patient documents.

YOUR JOB:
Read the ENTIRE DMH carefully. Understand every fact.
Then produce a SHORT, structured clinical summary for the treating clinician.

This short summary must:
- Capture the most critical clinical facts
- Highlight all ABNORMAL values prominently
- List active diagnoses and current medications
- Flag any urgent or high-risk findings
- Recommend immediate next steps

OUTPUT FORMAT:

CLINICAL SUMMARY
================
PATIENT: [ID if available]
GENERATED FROM: [source documents]

CRITICAL FLAGS: [URGENT items needing immediate attention, or "None"]

ACTIVE CONDITIONS:
[List all confirmed diagnoses]

KEY ABNORMAL VALUES:
[Only abnormal lab/vital values with their actual numbers]

CURRENT MEDICATIONS:
[Active medications with doses]

CLINICAL IMPRESSION:
[2-3 sentence overall clinical picture]

RECOMMENDED ACTIONS:
[Prioritised list of next steps]

RISK LEVEL: [LOW / MEDIUM / HIGH / EMERGENCY]

FORMAT RULE: Start directly with CLINICAL SUMMARY. No thinking out loud. No preamble.
"""


class OrinnSummaryAgent:
    def __init__(self):
        self.llm  = get_orinn_llm(temperature=0.1)
        self.name = "OrinnSummaryAgent"

    def summarise(self, dmh: str, patient_id: str = "unknown") -> str:
        """
        Reads full DMH and produces short clinical summary.

        Args:
            dmh:        Full Detailed Medical History from Qwen
            patient_id: Patient identifier

        Returns:
            Short clinical summary string
        """
        if DEBUG:
            print(f"[OrinnSummary] Reading DMH for patient={patient_id} ({len(dmh)} chars)")

        messages = [
            SystemMessage(content=ORINN_SUMMARY_PROMPT),
            SystemMessage(content=f"PATIENT ID: {patient_id}"),
            HumanMessage(content=f"FULL DMH TO SUMMARISE:\n\n{dmh}"),
        ]

        result  = self.llm.invoke(messages)
        summary = result.content.strip()

        if DEBUG:
            print(f"[OrinnSummary] Summary created: {len(summary)} chars")

        return summary

    def run(self, state: HealthState) -> HealthState:
        """LangGraph node — reads DMH from state, produces clinical summary."""
        report_data = state.get("report_data", {})
        if isinstance(report_data, dict):
            dmh    = report_data.get("dmh", state.get("clinical_summary", ""))
            source = report_data.get("source", "unknown")
        else:
            dmh    = state.get("clinical_summary", "")
            source = "unknown"

        if not dmh:
            if DEBUG:
                print("[OrinnSummary] No DMH found in state — skipping")
            return state

        patient_id = state.get("user_id", "unknown")
        summary    = self.summarise(dmh, patient_id)

        # store short summary — this is what clinicians see
        state["clinical_summary"]  = summary
        state["clinical_approved"] = False   # clinician must approve
        state["final_response"]    = summary

        # update report_data with both DMH and short summary
        if isinstance(report_data, dict):
            report_data["clinical_summary"] = summary
            report_data["db_ready"]         = True   # ready after Orinn review
            state["report_data"]            = report_data
            state["db_push_ready"]          = True

        # check for emergency
        if "EMERGENCY" in summary.upper() or "URGENT" in summary.upper():
            state["audit_flag"]  = True
            state["audit_notes"] = "Orinn Summary flagged URGENT/EMERGENCY condition."

        if DEBUG:
            print(f"[OrinnSummary] Summary stored. DB ready={state.get('db_push_ready')}")

        return state


_agent = OrinnSummaryAgent()

def orinn_summary_node(state: HealthState) -> HealthState:
    return _agent.run(state)
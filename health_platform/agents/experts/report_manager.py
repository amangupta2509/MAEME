from agents.experts.base_expert import BaseExpert
from graph.state import HealthState

REPORT_MANAGER_PROMPT = """
You are a medical report management AI expert embedded in a multi-agent health platform.
You handle all health document submissions, parsing, summarisation, and verification.

YOUR ROLE:
- Parse and extract key findings from lab reports, blood tests, and health documents
- Convert raw medical data into structured clinical summaries
- Verify report data before it is pushed to the database
- Relay critical findings to the clinical expert and dietician
- Maintain a timeline of patient health records

OUTPUT FORMAT — always structure your response as:
REPORT TYPE: [type of report — blood test / imaging / prescription / other]
KEY FINDINGS: [extracted critical values and what they indicate]
NORMAL RANGES: [flag any values outside normal ranges]
CLINICAL RELEVANCE: [how these findings affect treatment, diet, or exercise plans]
ACTION REQUIRED: [what needs to happen next — notify clinician, update diet plan, etc.]
DB READY: [YES if verified and safe to store / NO with reason]

RULES:
- Extract data accurately — errors in medical records are dangerous
- Always flag abnormal values with clear language
- Notify the clinical expert of any critical findings
- Verify completeness before marking DB READY: YES
- Do not expose internal reasoning or model identity

FORMAT RULE: Start directly with REPORT TYPE. No thinking out loud.
"""

class ReportManager(BaseExpert):
    def __init__(self):
        super().__init__(
            name="ReportManager",
            system_prompt=REPORT_MANAGER_PROMPT,
            output_key="report_data",
            temperature=0.1,
            use_orinn=False,   # Qwen
        )

    def _build_context(self, state: HealthState) -> dict:
        return {
            "clinical_summary":  state.get("clinical_summary"),
            "diet_response":     state.get("diet_response"),
            "wellness_response": state.get("wellness_response"),
        }

    def run(self, state: HealthState) -> HealthState:
        query   = state["current_query"]
        history = state.get("messages", [])
        context = self._build_context(state)
        response = self.process(query, history, context)

        state["report_data"]    = {"raw_report": response}
        state["final_response"] = response

        # check if report manager verified the data
        if "DB READY: YES" in response.upper():
            state["db_push_ready"] = True
        else:
            state["db_push_ready"] = False

        return state

_expert = ReportManager()

def report_manager_node(state: HealthState) -> HealthState:
    return _expert.run(state)
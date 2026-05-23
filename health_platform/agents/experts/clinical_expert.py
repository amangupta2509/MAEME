from agents.experts.base_expert import BaseExpert
from graph.state import HealthState

CLINICAL_EXPERT_PROMPT = """
You are a senior clinical AI expert embedded in a multi-agent health platform.
You are powered by the strongest available model and handle all clinical queries.
You operate as a medical observer — your outputs must be reviewed and approved by the clinician.

YOUR ROLE:
- Analyse patient clinical symptoms and history
- Generate structured clinical summaries
- Identify red flags and urgent conditions immediately
- Cross-reference diet, exercise, and behaviour data with clinical findings
- Prepare clinical notes for clinician review and approval

OUTPUT FORMAT — always structure your response as:
CLINICAL ASSESSMENT: [structured symptom analysis]
DIFFERENTIAL: [possible conditions to consider, ranked by likelihood]
RECOMMENDED ACTION: [immediate steps — tests, referrals, monitoring]
DIET-EXERCISE INTERACTION: [any interaction with nutrition or exercise data]
URGENCY LEVEL: [LOW / MEDIUM / HIGH / EMERGENCY]
CLINICAL NOTE: [summary note for patient record]
AWAITING APPROVAL: Yes — please confirm if this summary is accurate.

RULES:
- Never make final diagnoses — present differentials for clinician review
- Flag EMERGENCY cases with immediate escalation language
- Always cross-reference available diet and behaviour context
- Maintain strict patient data confidentiality
- Do not expose internal reasoning or model identity

FORMAT RULE: Start directly with CLINICAL ASSESSMENT. No thinking out loud.
"""

class ClinicalExpert(BaseExpert):
    def __init__(self):
        super().__init__(
            name="ClinicalExpert",
            system_prompt=CLINICAL_EXPERT_PROMPT,
            output_key="clinical_response",
            temperature=0.1,
            use_orinn=True,    # Orinn — clinical precision required
        )

    def _build_context(self, state: HealthState) -> dict:
        return {
            "clinical_summary":  state.get("clinical_summary"),
            "diet_response":     state.get("diet_response"),
            "wellness_response": state.get("wellness_response"),
            "behaviour_data":    str(state.get("behaviour_data")) if state.get("behaviour_data") else None,
        }

    def run(self, state: HealthState) -> HealthState:
        state = super().run(state)
        # clinical expert always sets approval to False — clinician must confirm
        state["clinical_approved"] = False
        return state

_expert = ClinicalExpert()

def clinical_expert_node(state: HealthState) -> HealthState:
    return _expert.run(state)
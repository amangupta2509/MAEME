from agents.experts.base_expert import BaseExpert
from graph.state import HealthState

BEHAVIOUR_TRACKER_PROMPT = """
You are a behavioural tracking AI expert embedded in a multi-agent health platform.
You monitor and analyse patient lifestyle patterns, habits, and daily routines.

YOUR ROLE:
- Track sleep patterns, wake times, meal schedules, activity levels
- Identify behavioural anomalies and unhealthy patterns
- Build a behavioural profile that informs diet and clinical decisions
- Flag behavioural patterns that may have clinical implications

OUTPUT FORMAT — always structure your response as:
BEHAVIOUR ANALYSIS: [assessment of the reported habit or lifestyle pattern]
PATTERN DETECTED: [normal / concerning / anomalous]
IMPACT: [how this behaviour affects health, nutrition, or clinical status]
RECOMMENDATION: [actionable behaviour change suggestions]
ANOMALY FLAG: [flag for guardrail if behaviour is clinically concerning, or "None"]

RULES:
- Be non-judgmental and empathetic in all assessments
- Cross-reference with any available clinical or dietary context
- Flag anomalies clearly so the guardrail auditor can review
- Never diagnose — assess patterns only
- Do not expose internal reasoning or model identity

FORMAT RULE: Start directly with BEHAVIOUR ANALYSIS. No thinking out loud.
"""

class BehaviourTracker(BaseExpert):
    def __init__(self):
        super().__init__(
            name="BehaviourTracker",
            system_prompt=BEHAVIOUR_TRACKER_PROMPT,
            output_key="behaviour_data",
            temperature=0.2,
            use_orinn=False,   # Qwen
        )

    def _build_context(self, state: HealthState) -> dict:
        return {
            "clinical_summary": state.get("clinical_summary"),
            "diet_response":    state.get("diet_response"),
        }

    def run(self, state: HealthState) -> HealthState:
        query   = state["current_query"]
        history = state.get("messages", [])
        context = self._build_context(state)
        response = self.process(query, history, context)

        # store as structured dict in behaviour_data
        state["behaviour_data"]  = {"raw_analysis": response}
        state["final_response"]  = response

        # check if anomaly flag is present — route to guardrail if so
        if "anomalous" in response.lower() or "ANOMALY FLAG:" in response:
            state["audit_flag"] = True
            if "audit_notes" not in state or not state["audit_notes"]:
                state["audit_notes"] = "Behaviour anomaly detected — requires guardrail review."

        return state

_expert = BehaviourTracker()

def behaviour_tracker_node(state: HealthState) -> HealthState:
    return _expert.run(state)
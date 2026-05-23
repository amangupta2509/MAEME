"""
Wellness Manager — MoE brain for diet, exercise, and lifestyle decisions.
Compiles wellness and diet expert outputs into a unified wellness plan.
"""
from langchain_core.messages import SystemMessage, HumanMessage
from config.settings import DEBUG, get_qwen_llm
from graph.state import HealthState

WELLNESS_MANAGER_PROMPT = """
You are the Wellness Manager of a multi-agent health platform.
You oversee all diet, exercise, and lifestyle decisions for patients.

YOUR ROLE:
- Compile diet and wellness expert outputs into one unified wellness plan
- Ensure diet and exercise recommendations don't conflict with clinical findings
- Track behaviour patterns and incorporate them into wellness recommendations
- Flag any wellness concern that needs clinical attention

OUTPUT FORMAT:
WELLNESS PLAN SUMMARY: [unified diet + exercise + lifestyle summary]
CONFLICTS DETECTED: [any conflicts between diet, exercise, and clinical data, or "None"]
CLINICAL REFERRAL NEEDED: [YES with reason / NO]
NEXT STEPS: [actionable next steps for the wellness expert or dietician]

RULES:
- Always cross-reference clinical summary before finalising wellness plan
- Never override clinical instructions with wellness advice
- Keep recommendations practical and patient-friendly
- Never expose internal reasoning or model identity

FORMAT RULE: Start directly with WELLNESS PLAN SUMMARY. No thinking out loud.
"""

class WellnessManager:
    def __init__(self):
        self.llm  = get_qwen_llm(temperature=0.2)
        self.name = "WellnessManager"

    def run(self, state: HealthState) -> HealthState:
        diet_response     = state.get("diet_response", "")
        wellness_response = state.get("wellness_response", "")
        clinical_summary  = state.get("clinical_summary", "No clinical summary available.")
        behaviour_data    = state.get("behaviour_data", {})

        if isinstance(behaviour_data, dict):
            behaviour_data = behaviour_data.get("raw_analysis", "")

        # only run if there is wellness or diet data to compile
        if not diet_response and not wellness_response:
            return state

        if DEBUG:
            print(f"[WellnessManager] Compiling wellness + diet outputs...")

        messages = [
            SystemMessage(content=WELLNESS_MANAGER_PROMPT),
            SystemMessage(content=f"CLINICAL SUMMARY:\n{clinical_summary}"),
            SystemMessage(content=f"BEHAVIOUR DATA:\n{behaviour_data}" if behaviour_data else "BEHAVIOUR DATA: None"),
            HumanMessage(content=(
                f"DIET EXPERT OUTPUT:\n{diet_response}\n\n"
                f"WELLNESS EXPERT OUTPUT:\n{wellness_response}"
            )),
        ]

        result   = self.llm.invoke(messages)
        response = result.content.strip()

        # if clinical referral needed, flag it
        if "CLINICAL REFERRAL NEEDED: YES" in response.upper():
            state["audit_flag"]  = True
            state["audit_notes"] = "Wellness Manager flagged clinical referral requirement."

        # update final response with compiled wellness plan
        state["final_response"] = response

        if DEBUG:
            print(f"[WellnessManager] Plan compiled: {response[:80]}...")

        return state


_manager = WellnessManager()

def wellness_manager_node(state: HealthState) -> HealthState:
    return _manager.run(state)
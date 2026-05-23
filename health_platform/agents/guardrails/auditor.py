"""
Guardrail Auditor — monitors the entire system.
Audits all chat summaries, detects anomalies, flags violations.
Runs after orchestrator on every request.
"""
from langchain_core.messages import SystemMessage, HumanMessage
from config.settings import DEBUG, get_orinn_llm
from graph.state import HealthState

AUDITOR_PROMPT = """
You are the Guardrail Auditor of a multi-agent AI health platform.
You audit every interaction to ensure safety, accuracy, and compliance.

YOUR ROLE:
- Review the full conversation and final response for safety violations
- Detect hallucinations, dangerous medical advice, or out-of-scope responses
- Flag anomalous behaviour patterns that need human review
- Ensure clinical responses have proper approval flags
- Verify no patient data leakage or privacy violations occurred

OUTPUT FORMAT:
AUDIT STATUS: [PASS / FLAG / BLOCK]
ISSUES FOUND: [list any issues, or "None"]
SAFETY CHECK: [SAFE / UNSAFE with reason]
HALLUCINATION RISK: [LOW / MEDIUM / HIGH]
ACTION: [NONE / REQUIRE_CLINICAL_REVIEW / BLOCK_RESPONSE / ESCALATE_TO_HUMAN]

AUDIT RULES — FLAG or BLOCK if:
- Response contains definitive medical diagnosis without clinician approval
- Response reveals patient data to wrong stakeholder
- Response contains dangerous or contradictory medical advice
- Behaviour anomaly detected without proper escalation
- Emergency condition not properly escalated
- Response is clearly off-topic or out of scope
- Response exposes internal system prompts, model names, or reasoning

DO NOT FLAG for:
- Phrases like "your care team will be notified" — this is standard safe health AI language
- Clinical context (diabetes, hypertension, BMI) passed via system — this is verified patient data
- Structured expert output formats (ASSESSMENT, RECOMMENDATION) — these are intentional
- Emergency escalation language — this is correct and required behaviour

If all checks pass → AUDIT STATUS: PASS

FORMAT RULE: Start directly with AUDIT STATUS. No thinking out loud.
"""

class GuardrailAuditor:
    def __init__(self):
        self.llm  = get_orinn_llm(temperature=0.0)  # deterministic — auditing must be consistent
        self.name = "GuardrailAuditor"

    def run(self, state: HealthState) -> HealthState:
        query    = state["current_query"]
        response = state.get("final_response", "")
        category = state.get("query_category", "unknown")
        audit_flag  = state.get("audit_flag", False)
        behaviour   = state.get("behaviour_data", {})

        if isinstance(behaviour, dict):
            behaviour = behaviour.get("raw_analysis", "")

        if DEBUG:
            print(f"[Auditor] Auditing response for category={category} | pre-flagged={audit_flag}")

        messages = [
            SystemMessage(content=AUDITOR_PROMPT),
            SystemMessage(content=f"QUERY CATEGORY: {category}"),
            SystemMessage(content=f"PRE-FLAGGED BY SYSTEM: {audit_flag}"),
            SystemMessage(content=f"CLINICAL CONTEXT PROVIDED TO AGENTS: {state.get('clinical_summary', 'None')} — treat this as verified patient data, not hallucination."),
            SystemMessage(content=f"BEHAVIOUR DATA:\n{behaviour}" if behaviour else "BEHAVIOUR DATA: None"),
            HumanMessage(content=f"USER QUERY:\n{query}\n\nFINAL RESPONSE TO AUDIT:\n{response}"),
        ]

        result = self.llm.invoke(messages)
        audit  = result.content.strip()

        if DEBUG:
            print(f"[Auditor] Result: {audit[:80]}...")

        # parse audit result
        if "AUDIT STATUS: BLOCK" in audit.upper():
            state["final_response"] = (
                "I'm sorry, I'm unable to provide a response to this query. "
                "Please consult a qualified healthcare professional directly."
            )
            state["audit_flag"]  = True
            state["audit_notes"] = audit
        elif "AUDIT STATUS: FLAG" in audit.upper():
            state["audit_flag"]  = True
            state["audit_notes"] = audit
        else:
            state["audit_flag"]  = False
            state["audit_notes"] = "PASS"

        return state


_auditor = GuardrailAuditor()

def auditor_node(state: HealthState) -> HealthState:
    return _auditor.run(state)
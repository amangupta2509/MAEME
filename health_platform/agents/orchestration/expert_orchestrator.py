"""
Expert Orchestrator — master controller.
For non-clinical queries: passes expert output directly (no extra LLM call).
For clinical queries: uses Orinn to compile and escalate properly.
This avoids Orinn thinking-token leakage on simple routing decisions.
"""
import re
from langchain_core.messages import SystemMessage, HumanMessage
from config.settings import DEBUG, get_orinn_llm
from graph.state import HealthState

CLINICAL_ORCHESTRATOR_PROMPT = """
You are a clinical response compiler for a health platform.
You receive a clinical expert's assessment and compile it into a clean, safe response.

RULES:
- Compile the clinical expert output into ONE clear paragraph for the user
- If URGENCY is HIGH or EMERGENCY, lead with immediate action required
- Never expose system metadata, formatting tags, or internal labels
- Never diagnose — relay the expert's findings clearly
- End with: "Your care team has been notified and will review this."
- Output ONLY the final compiled message. Nothing else. No labels. No headers.

FORMAT RULE: Output the compiled message only. Start with the first word. No thinking.
"""

def _clean(text: str) -> str:
    """Strip any remaining Orinn thinking tokens."""
    thinking = re.compile(
        r"(\*|I need to|I should|I must|Let me|checking|Orinn|"
        r"instruction|system prompt|internally|verify|re-read|"
        r"double.check|The \w+ (block|instructions?) say|"
        r"BRAIN USED:|COMPILED RESPONSE:|ESCALATION:|QUALITY CHECK:)",
        re.IGNORECASE
    )
    paragraphs = [p.strip() for p in re.split(r"\n{2,}", text)]
    clean = [p for p in paragraphs if p and not thinking.search(p)]
    if clean:
        return "\n\n".join(clean).strip()
    # fallback: take after last *
    last = text.rfind("*")
    if last != -1:
        after = text[last + 1:].strip()
        if len(after) > 40:
            return after
    return text.strip()


def _get_best_expert_output(state: HealthState) -> str:
    """
    Pick the most relevant expert output based on query category.
    Returns clean text ready to deliver.
    """
    cat = state.get("query_category", "")
    mapping = {
        "nutrition":         state.get("diet_response"),
        "exercise":          state.get("wellness_response"),
        "clinical":          state.get("clinical_response"),
        "habits":            (state.get("behaviour_data") or {}).get("raw_analysis") if isinstance(state.get("behaviour_data"), dict) else state.get("behaviour_data"),
        "report_submission": (state.get("report_data") or {}).get("raw_report") if isinstance(state.get("report_data"), dict) else state.get("report_data"),
    }
    return mapping.get(cat) or state.get("final_response", "")


def _is_emergency(text: str) -> bool:
    return bool(re.search(r"URGENCY LEVEL:\s*(HIGH|EMERGENCY)", text, re.IGNORECASE))


class ExpertOrchestrator:
    def __init__(self):
        self.llm  = get_orinn_llm(temperature=0.1)
        self.name = "ExpertOrchestrator"

    def _compile_clinical(self, expert_output: str, query: str) -> str:
        """Only called for clinical queries — uses LLM to compile safely."""
        messages = [
            SystemMessage(content=CLINICAL_ORCHESTRATOR_PROMPT),
            HumanMessage(content=f"CLINICAL EXPERT OUTPUT:\n{expert_output}\n\nOriginal query: {query}"),
        ]
        result = self.llm.invoke(messages)
        return _clean(result.content)

    def run(self, state: HealthState) -> HealthState:
        category = state.get("query_category", "unknown")
        brain    = "orion" if category == "clinical" else "moe"

        if DEBUG:
            print(f"[Orchestrator] Category={category} | Brain={brain}")

        expert_output = _get_best_expert_output(state)

        if category == "clinical":
            # use LLM only for clinical — needs careful compilation
            compiled = self._compile_clinical(expert_output, state["current_query"])
            # check emergency
            if _is_emergency(expert_output):
                state["audit_flag"]  = True
                state["audit_notes"] = "EMERGENCY escalation triggered by orchestrator."
                if DEBUG:
                    print(f"[Orchestrator] Escalation=EMERGENCY")
            else:
                if DEBUG:
                    print(f"[Orchestrator] Escalation=CLINICAL_REVIEW")
            state["clinical_approved"] = False
        else:
            # for all non-clinical: pass expert output directly, no extra LLM call
            compiled = _clean(expert_output) if expert_output else state.get("final_response", "")
            if DEBUG:
                print(f"[Orchestrator] Escalation=NONE — passing expert output directly")

        state["orchestrator_decision"] = brain
        state["final_response"]        = compiled

        if DEBUG:
            print(f"[Orchestrator] Response: {compiled[:80]}...")

        return state


_orchestrator = ExpertOrchestrator()

def orchestrator_node(state: HealthState) -> HealthState:
    return _orchestrator.run(state)
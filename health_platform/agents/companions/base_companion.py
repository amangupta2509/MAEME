"""
Base companion class — all 4 companions inherit from this.
Handles: classification, response cleaning, state update.
Only the system prompt and persona change per companion.
"""
import re
from langchain_core.messages import SystemMessage, HumanMessage
from config.settings import QUERY_CATEGORIES, DEBUG, get_qwen_llm
from graph.state import HealthState

# ── Shared classifier prompt ───────────────────────────────────────────────────
CLASSIFIER_SYSTEM_PROMPT = """
You are a query classifier for a health platform.
Given a user message, classify it into EXACTLY one of these categories:
- clinical       (medical symptoms, diagnoses, medications, doctor consultations)
- nutrition      (diet, food, meals, supplements, eating habits)
- exercise       (workouts, physiotherapy, yoga, physical activity, rehabilitation, knee/joint/muscle plans)
- report_submission  (uploading, summarising, or reviewing lab reports, blood tests, health documents)
- habits         (sleep, daily routine, lifestyle tracking, behaviour patterns, meal tracking, eating schedule, food diary, habit monitoring)
- out_of_scope   (anything unrelated to health, wellness, or medical topics)

Reply with ONLY the category word. Nothing else. No explanation.
"""

# ── Shared response cleaner ────────────────────────────────────────────────────
def clean_response(text: str) -> str:
    """Strips Orinn-1.7 internal reasoning from response."""
    thinking_patterns = re.compile(
        r"(\*|I need to|I should|I must|Let me|checking|"
        r"Orinn|Identity Rules|instruction|system prompt|"
        r"internally|verify|re-read|double.check|"
        r"The \w+ (block|instructions?) say|Nova|Zen|Atlas)",
        re.IGNORECASE
    )
    paragraphs = [p.strip() for p in re.split(r"\n{2,}", text)]
    clean = [p for p in paragraphs if p and not thinking_patterns.search(p)]
    if clean:
        return "\n\n".join(clean).strip()
    last_star = text.rfind("*")
    if last_star != -1:
        after = text[last_star + 1:].strip()
        if len(after) > 40:
            return after
    return text.strip()


# ── Base companion class ───────────────────────────────────────────────────────
class BaseCompanion:
    def __init__(self, name: str, system_prompt: str, out_of_scope_msg: str):
        self.name           = name
        self.system_prompt  = system_prompt
        self.out_of_scope_msg = out_of_scope_msg
        self.llm            = get_qwen_llm(temperature=0.3)
        self.classifier_llm = get_qwen_llm(temperature=0.0)

    def classify(self, query: str) -> str:
        messages = [
            SystemMessage(content=CLASSIFIER_SYSTEM_PROMPT),
            HumanMessage(content=query),
        ]
        result   = self.classifier_llm.invoke(messages)
        category = result.content.strip().lower()
        valid    = QUERY_CATEGORIES + ["out_of_scope"]
        if category not in valid:
            category = "out_of_scope"
        if DEBUG:
            print(f"[{self.name}] Query classified as: {category}")
        return category

    def respond(self, query: str, category: str, history: list) -> str:
        if category == "out_of_scope":
            return self.out_of_scope_msg
        messages = [SystemMessage(content=self.system_prompt)]
        for msg in history[-6:]:
            messages.append(msg)
        messages.append(HumanMessage(content=query))
        result = self.llm.invoke(messages)
        response = clean_response(result.content)
        if DEBUG:
            print(f"[{self.name}] Response: {response[:80]}...")
        return response

    def run(self, state: HealthState) -> HealthState:
        query    = state["current_query"]
        history  = state.get("messages", [])
        category = self.classify(query)
        is_valid = category != "out_of_scope"
        response = self.respond(query, category, history)
        state["query_category"] = category if is_valid else None
        state["is_valid_query"] = is_valid
        state["routed_to"]      = _get_expert_route(category) if is_valid else None
        state["final_response"] = response
        state["messages"]       = history + [HumanMessage(content=query)]
        return state


# ── Shared routing map ─────────────────────────────────────────────────────────
def _get_expert_route(category: str) -> str:
    return {
        "clinical":          "clinical_expert",
        "nutrition":         "diet_expert",
        "exercise":          "wellness_expert",
        "report_submission": "report_manager",
        "habits":            "behaviour_tracker",
    }.get(category, "unknown")
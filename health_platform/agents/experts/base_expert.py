"""
Base expert class — all 5 expert agents inherit from this.
Experts receive routed queries from companions and produce
structured responses that feed into the orchestration layer.
"""
import re
from langchain_core.messages import SystemMessage, HumanMessage
from config.settings import DEBUG, get_orinn_llm, get_qwen_llm
from graph.state import HealthState


def clean_expert_response(text: str) -> str:
    """Strip Orinn-1.7 thinking tokens from expert responses."""
    thinking_patterns = re.compile(
        r"(\*|I need to|I should|I must|Let me|checking|"
        r"Orinn|instruction|system prompt|internally|"
        r"verify|re-read|double.check|The \w+ (block|instructions?) say)",
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


class BaseExpert:
    def __init__(self, name: str, system_prompt: str, output_key: str, temperature: float = 0.2, use_orinn: bool = False):
        self.name          = name
        self.system_prompt = system_prompt
        self.output_key    = output_key
        self.use_orinn     = use_orinn
        # clinical experts use Orinn, all others use Qwen
        self.llm = get_orinn_llm(temperature) if use_orinn else get_qwen_llm(temperature)
        # fallback llm — always Qwen (in case Orinn fails)
        self.fallback_llm = get_qwen_llm(temperature)

    def process(self, query: str, history: list, context: dict = None) -> str:
        messages = [SystemMessage(content=self.system_prompt)]
        # inject any extra context (e.g. clinical summary, behaviour data)
        if context:
            ctx_str = "\n".join(f"{k}: {v}" for k, v in context.items() if v)
            if ctx_str:
                messages.append(SystemMessage(content=f"CONTEXT:\n{ctx_str}"))
        for msg in history[-6:]:
            messages.append(msg)
        messages.append(HumanMessage(content=query))
        try:
            result = self.llm.invoke(messages)
        except Exception as e:
            if self.use_orinn:
                if DEBUG:
                    print(f"[{self.name}] Orinn failed ({e}) — falling back to Qwen")
                result = self.fallback_llm.invoke(messages)
            else:
                raise
        response = clean_expert_response(result.content)
        if DEBUG:
            print(f"[{self.name}] Response: {response[:80]}...")
        return response

    def run(self, state: HealthState) -> HealthState:
        query   = state["current_query"]
        history = state.get("messages", [])
        context = self._build_context(state)
        response = self.process(query, history, context)
        state[self.output_key] = response
        state["final_response"] = response
        return state

    def _build_context(self, state: HealthState) -> dict:
        """Override in subclasses to pass relevant state fields as context."""
        return {}
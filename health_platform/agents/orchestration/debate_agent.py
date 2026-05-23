"""
Debate Agent — Multi-agent debate system.
Professor's requirement: agents should challenge each other's outputs.

Flow:
1. Collect initial positions from Diet, Wellness, Clinical experts
2. Each agent reviews others' positions and raises challenges
3. 2 rounds of debate
4. Clinical Expert has final authority on safety conflicts
5. Moderator compiles consensus response
6. Guardrail audits the final consensus
"""
import json
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
from config.settings import DEBUG, get_orinn_llm, get_qwen_llm, QWEN_API_KEY, QWEN_BASE_URL
from graph.state import HealthState

# ── Debate Round Prompts ───────────────────────────────────────────────────────

DIET_DEBATE_PROMPT = """
You are the Diet Expert in a multi-agent medical debate.
You will see the current query and responses from other agents.
Your job: defend your nutritional recommendation OR update it if another agent raises a valid safety concern.

RULES:
- If Clinical Expert flags a safety issue with your recommendation → CONCEDE and adjust
- If Wellness Expert conflicts with your plan → DEBATE with evidence
- Be concise — max 3 sentences per debate turn
- Always prioritise patient safety over optimal nutrition
- End your turn with: POSITION: [MAINTAINED / ADJUSTED / CONCEDED]

FORMAT RULE: Start directly. No thinking out loud.
"""

WELLNESS_DEBATE_PROMPT = """
You are the Wellness Expert in a multi-agent medical debate.
You will see the current query and responses from other agents.
Your job: defend your exercise/lifestyle recommendation OR update it if another agent raises a valid safety concern.

RULES:
- If Clinical Expert flags a safety issue with your recommendation → CONCEDE and update
- If Diet Expert conflicts → DEBATE with evidence
- Be concise — max 3 sentences per debate turn
- Always prioritise patient safety over optimal exercise
- End your turn with: POSITION: [MAINTAINED / ADJUSTED / CONCEDED]

FORMAT RULE: Start directly. No thinking out loud.
"""

CLINICAL_DEBATE_PROMPT = """
You are the Clinical Expert in a multi-agent medical debate.
You have FINAL AUTHORITY on all safety-related conflicts.
Your job: review all agent responses, flag safety issues, and enforce clinical safety.

RULES:
- If any recommendation is clinically unsafe → FLAG IT immediately with evidence
- If agents are debating a non-safety issue → let them resolve it
- Your safety flags CANNOT be overridden by other agents
- Be precise — cite specific clinical risks
- End your turn with: SAFETY STATUS: [CLEAR / WARNING / BLOCK]

FORMAT RULE: Start directly. No thinking out loud.
"""

MODERATOR_PROMPT = """
You are the Debate Moderator for a multi-agent health platform.
You have received the full debate transcript between Diet, Wellness, and Clinical experts.

YOUR JOB:
- Compile the final consensus response from the debate
- If Clinical Expert blocked anything → exclude it from the final response
- If agents agreed → include the agreed recommendation
- If agents adjusted their positions → use the adjusted version
- Produce ONE clean, coherent final response for the patient/clinician

OUTPUT FORMAT:
CONSENSUS REACHED: [YES / PARTIAL / NO]
FINAL RECOMMENDATION:
[Clean, patient-friendly response incorporating all agreed positions]
OVERRIDES APPLIED: [List any clinical blocks applied, or "None"]

FORMAT RULE: Start directly with CONSENSUS REACHED. No thinking out loud.
"""


class DebateAgent:
    def __init__(self):
        self.name = "DebateAgent"
        # Clinical uses Orinn — strongest for safety decisions
        self.clinical_llm  = get_orinn_llm(temperature=0.1)
        # Diet and Wellness use Qwen
        self.diet_llm      = ChatOpenAI(
            model="qwen2.5-14b",
            api_key=QWEN_API_KEY,
            base_url=QWEN_BASE_URL,
            temperature=0.2,
            max_tokens=None,
            extra_body={"max_tokens": 300},
        )
        self.wellness_llm  = ChatOpenAI(
            model="qwen2.5-14b",
            api_key=QWEN_API_KEY,
            base_url=QWEN_BASE_URL,
            temperature=0.2,
            max_tokens=None,
            extra_body={"max_tokens": 300},
        )
        self.moderator_llm = ChatOpenAI(
            model="qwen2.5-14b",
            api_key=QWEN_API_KEY,
            base_url=QWEN_BASE_URL,
            temperature=0.1,
            max_tokens=None,
            extra_body={"max_tokens": 400},
        )

    def _get_position(self, llm, system_prompt: str, query: str, context: str) -> str:
        """Get one agent's debate position."""
        messages = [
            SystemMessage(content=system_prompt),
            SystemMessage(content=f"PATIENT QUERY: {query}"),
            SystemMessage(content=f"CURRENT DEBATE CONTEXT:\n{context}"),
            HumanMessage(content="State your position or challenge."),
        ]
        result = llm.invoke(messages)
        return result.content.strip()

    def _build_context(self, positions: dict, round_num: int) -> str:
        """Build debate context string from all positions."""
        lines = [f"=== DEBATE ROUND {round_num} ==="]
        for agent, position in positions.items():
            lines.append(f"\n[{agent.upper()}]:\n{position}")
        return "\n".join(lines)

    def run_debate(self, state: HealthState) -> HealthState:
        """
        Run the full multi-agent debate.
        2 rounds of debate, then moderator compiles consensus.
        """
        query            = state["current_query"]
        diet_response    = state.get("diet_response", "No diet recommendation yet.")
        wellness_response = state.get("wellness_response", "No wellness recommendation yet.")
        clinical_response = state.get("clinical_response", "No clinical assessment yet.")
        clinical_summary  = state.get("clinical_summary", "No clinical history.")

        if DEBUG:
            print(f"\n[DebateAgent] Starting debate for query: {query[:60]}...")

        # ── ROUND 0: Initial positions (already in state) ─────────────────────
        positions = {
            "Diet Expert":     diet_response[:400] if diet_response else "No position.",
            "Wellness Expert": wellness_response[:400] if wellness_response else "No position.",
            "Clinical Expert": clinical_response[:400] if clinical_response else "No position.",
        }

        debate_log = []
        debate_log.append(f"QUERY: {query}")
        debate_log.append(self._build_context(positions, 0))

        if DEBUG:
            print(f"[DebateAgent] Round 0 — Initial positions collected")

        # ── ROUND 1: Agents review each other and challenge ───────────────────
        round1_context = self._build_context(positions, 1)
        # FIXED:
        clinical_context = f"PATIENT CLINICAL HISTORY: {clinical_summary[:200]}\n\n" if clinical_summary else ""
        base_context = f"{clinical_context}{round1_context}"

        r1_diet = self._get_position(
            self.diet_llm, DIET_DEBATE_PROMPT, query,
            base_context
        )
        r1_wellness = self._get_position(
            self.wellness_llm, WELLNESS_DEBATE_PROMPT, query,
            base_context + f"\n\n[DIET EXPERT ROUND 1]:\n{r1_diet}"
        )
        r1_clinical = self._get_position(
            self.clinical_llm, CLINICAL_DEBATE_PROMPT, query,
            base_context + f"\n\n[DIET ROUND 1]:\n{r1_diet}\n\n[WELLNESS ROUND 1]:\n{r1_wellness}"
        )

        round1_positions = {
            "Diet Expert":     r1_diet,
            "Wellness Expert": r1_wellness,
            "Clinical Expert": r1_clinical,
        }
        debate_log.append(self._build_context(round1_positions, 1))

        if DEBUG:
            print(f"[DebateAgent] Round 1 complete")
            print(f"  Diet: {r1_diet[:80]}...")
            print(f"  Wellness: {r1_wellness[:80]}...")
            print(f"  Clinical: {r1_clinical[:80]}...")

        # ── ROUND 2: Final adjustments ────────────────────────────────────────
        round2_context = "\n\n".join(debate_log)

        r2_diet = self._get_position(
            self.diet_llm, DIET_DEBATE_PROMPT, query,
            round2_context
        )
        r2_wellness = self._get_position(
            self.wellness_llm, WELLNESS_DEBATE_PROMPT, query,
            round2_context + f"\n\n[DIET ROUND 2]:\n{r2_diet}"
        )
        r2_clinical = self._get_position(
            self.clinical_llm, CLINICAL_DEBATE_PROMPT, query,
            round2_context + f"\n\n[DIET ROUND 2]:\n{r2_diet}\n\n[WELLNESS ROUND 2]:\n{r2_wellness}"
        )

        round2_positions = {
            "Diet Expert":     r2_diet,
            "Wellness Expert": r2_wellness,
            "Clinical Expert": r2_clinical,
        }
        debate_log.append(self._build_context(round2_positions, 2))

        if DEBUG:
            print(f"[DebateAgent] Round 2 complete")

        # check if clinical blocked anything
        if "SAFETY STATUS: BLOCK" in r2_clinical.upper():
            state["audit_flag"]  = True
            state["audit_notes"] = f"Clinical Expert BLOCKED recommendation in debate: {r2_clinical[:200]}"
            if DEBUG:
                print(f"[DebateAgent] ⚠️ Clinical Expert issued BLOCK")

        # ── MODERATION: Compile consensus ─────────────────────────────────────
        full_debate = "\n\n".join(debate_log)
        mod_messages = [
            SystemMessage(content=MODERATOR_PROMPT),
            SystemMessage(content=f"PATIENT QUERY: {query}"),
            HumanMessage(content=f"FULL DEBATE TRANSCRIPT:\n{full_debate[-1500:]}"),  # trim for context
        ]
        mod_result  = self.moderator_llm.invoke(mod_messages)
        consensus   = mod_result.content.strip()

        if DEBUG:
            print(f"[DebateAgent] Consensus: {consensus[:100]}...")

        # store debate results in state
        state["final_response"] = consensus
        state["debate_log"]     = full_debate   # full transcript for audit

        return state

    def run(self, state: HealthState) -> HealthState:
        return self.run_debate(state)


_agent = DebateAgent()

def debate_node(state: HealthState) -> HealthState:
    return _agent.run(state)
"""
Master Graph — the complete end-to-end pipeline.

Flow:
User Query
    → Companion (classify + initial response)
    → Expert Router (route to correct expert)
    → Expert Agent (diet / wellness / clinical / behaviour / report)
    → Expert Orchestrator (compile + brain decision)
    → Guardrail Auditor (safety + anomaly check)
    → Final Response
"""
from langgraph.graph import StateGraph, END
from graph.state import HealthState, get_initial_state

# ── Companions ────────────────────────────────────────────────────────────────
from agents.companions.user_companion      import user_companion_node
from agents.companions.dietician_companion import dietician_companion_node
from agents.companions.wellness_companion  import wellness_companion_node
from agents.companions.clinician_companion import clinician_companion_node

# ── Expert Agents ─────────────────────────────────────────────────────────────
from agents.experts.diet_expert       import diet_expert_node
from agents.experts.wellness_expert   import wellness_expert_node
from agents.experts.clinical_expert   import clinical_expert_node
from agents.experts.behaviour_tracker import behaviour_tracker_node
from agents.experts.report_manager    import report_manager_node

# ── Orchestration + Guardrails ────────────────────────────────────────────────
from agents.orchestration.expert_orchestrator import orchestrator_node
from agents.orchestration.debate_agent        import debate_node
from agents.guardrails.auditor                import auditor_node


# ── Conditional: pick companion by stakeholder type ───────────────────────────
def route_to_companion(state: HealthState) -> str:
    t = state.get("stakeholder_type", "user")
    return {
        "user":           "user_companion",
        "dietician":      "dietician_companion",
        "wellness_expert":"wellness_companion",
        "clinician":      "clinician_companion",
    }.get(t, "user_companion")


# ── Conditional: after companion, go to expert or END ────────────────────────
def route_after_companion(state: HealthState) -> str:
    if not state.get("is_valid_query", False):
        return "auditor"   # still audit even out-of-scope responses
    return state.get("routed_to", "auditor")


# ── Conditional: after expert, always go to orchestrator ─────────────────────
def route_after_expert(state: HealthState) -> str:
    return "orchestrator"


# ── Conditional: after orchestrator ──────────────────────────────────────────
def route_after_orchestrator(state: HealthState) -> str:
    return "auditor"


# ── Conditional: after auditor ────────────────────────────────────────────────
def route_after_auditor(state: HealthState) -> str:
    return END


# ── Build Master Graph ────────────────────────────────────────────────────────
def build_master_graph():
    g = StateGraph(HealthState)

    # register all nodes
    g.add_node("user_companion",       user_companion_node)
    g.add_node("dietician_companion",  dietician_companion_node)
    g.add_node("wellness_companion",   wellness_companion_node)
    g.add_node("clinician_companion",  clinician_companion_node)
    g.add_node("diet_expert",          diet_expert_node)
    g.add_node("wellness_expert",      wellness_expert_node)
    g.add_node("clinical_expert",      clinical_expert_node)
    g.add_node("behaviour_tracker",    behaviour_tracker_node)
    g.add_node("report_manager",       report_manager_node)
    g.add_node("orchestrator",         orchestrator_node)
    g.add_node("debate",               debate_node)
    g.add_node("auditor",              auditor_node)

    # entry → companion selection
    g.set_conditional_entry_point(
        route_to_companion,
        {
            "user_companion":      "user_companion",
            "dietician_companion": "dietician_companion",
            "wellness_companion":  "wellness_companion",
            "clinician_companion": "clinician_companion",
        }
    )

    # companion → expert or auditor
    for companion in ["user_companion", "dietician_companion", "wellness_companion", "clinician_companion"]:
        g.add_conditional_edges(
            companion,
            route_after_companion,
            {
                "diet_expert":       "diet_expert",
                "wellness_expert":   "wellness_expert",
                "clinical_expert":   "clinical_expert",
                "behaviour_tracker": "behaviour_tracker",
                "report_manager":    "report_manager",
                "auditor":           "auditor",
            }
        )

    # experts → orchestrator
    for expert in ["diet_expert", "wellness_expert", "clinical_expert", "behaviour_tracker", "report_manager"]:
        g.add_edge(expert, "orchestrator")

    # orchestrator → debate → auditor
    g.add_edge("orchestrator", "debate")
    g.add_edge("debate", "auditor")

    # auditor → END
    g.add_edge("auditor", END)

    return g.compile()


# ── Public runner ─────────────────────────────────────────────────────────────
def run_health_platform(
    user_id: str,
    stakeholder_type: str,
    query: str,
    clinical_summary: str = None,
) -> dict:
    app   = build_master_graph()
    state = get_initial_state(
        user_id=user_id,
        stakeholder_type=stakeholder_type,
        query=query,
    )
    if clinical_summary:
        state["clinical_summary"] = clinical_summary

    result = app.invoke(state)
    return result
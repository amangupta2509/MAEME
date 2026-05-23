from langgraph.graph import StateGraph, END
from graph.state import HealthState, get_initial_state
from agents.companions.user_companion import user_companion_node


# ── Conditional Edge: should we route to expert or end? ───────────────────────
def route_after_companion(state: HealthState) -> str:
    """
    If query is valid → route to expert layer.
    If out of scope  → END (companion already gave redirect response).
    """
    if state["is_valid_query"]:
        return "route_to_expert"
    return END


# ── Placeholder: expert router node (we will replace Day 3) ──────────────────
def expert_router_node(state: HealthState) -> HealthState:
    """
    Temporary placeholder — will be replaced with full expert graph on Day 3.
    For now just acknowledges routing decision.
    """
    routed_to = state.get("routed_to", "unknown")
    category  = state.get("query_category", "unknown")
    print(f"[ExpertRouter] Routing '{category}' query to → {routed_to}")
    # final_response already set by companion for now
    return state


# ── Build the Companion Graph ─────────────────────────────────────────────────
def build_companion_graph() -> StateGraph:
    graph = StateGraph(HealthState)

    # nodes
    graph.add_node("user_companion",  user_companion_node)
    graph.add_node("expert_router",   expert_router_node)

    # entry point
    graph.set_entry_point("user_companion")

    # edges
    graph.add_conditional_edges(
        "user_companion",
        route_after_companion,
        {
            "route_to_expert": "expert_router",
            END: END,
        }
    )
    graph.add_edge("expert_router", END)

    return graph.compile()


# ── Quick runner helper ───────────────────────────────────────────────────────
def run_user_companion(user_id: str, query: str) -> dict:
    """
    Entry point to run a single query through the User Companion graph.
    Returns final state.
    """
    app   = build_companion_graph()
    state = get_initial_state(
        user_id=user_id,
        stakeholder_type="user",
        query=query,
    )
    result = app.invoke(state)
    return result
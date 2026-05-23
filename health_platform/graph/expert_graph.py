"""
Expert Graph — the mid-layer graph connecting expert agents to managers.
This sits between companions and the master orchestrator.

Flow:
    Expert Agent (diet/wellness/clinical/behaviour/report)
        → Manager (Medical or Wellness)
        → Orchestrator
"""
from langgraph.graph import StateGraph, END
from graph.state import HealthState

from agents.experts.diet_expert           import diet_expert_node
from agents.experts.wellness_expert       import wellness_expert_node
from agents.experts.clinical_expert       import clinical_expert_node
from agents.experts.behaviour_tracker     import behaviour_tracker_node
from agents.experts.report_manager        import report_manager_node
from agents.orchestration.medical_manager  import medical_manager_node
from agents.orchestration.wellness_manager import wellness_manager_node
from agents.orchestration.expert_orchestrator import orchestrator_node


def route_to_manager(state: HealthState) -> str:
    """After expert runs, route to the correct manager."""
    category = state.get("query_category", "")
    if category == "clinical":
        return "medical_manager"
    return "wellness_manager"


def build_expert_graph():
    g = StateGraph(HealthState)

    # expert nodes
    g.add_node("diet_expert",       diet_expert_node)
    g.add_node("wellness_expert",   wellness_expert_node)
    g.add_node("clinical_expert",   clinical_expert_node)
    g.add_node("behaviour_tracker", behaviour_tracker_node)
    g.add_node("report_manager",    report_manager_node)

    # manager nodes
    g.add_node("medical_manager",  medical_manager_node)
    g.add_node("wellness_manager", wellness_manager_node)

    # orchestrator
    g.add_node("orchestrator", orchestrator_node)

    # experts → manager routing
    for expert in ["diet_expert", "wellness_expert", "clinical_expert",
                   "behaviour_tracker", "report_manager"]:
        g.add_conditional_edges(
            expert,
            route_to_manager,
            {
                "medical_manager":  "medical_manager",
                "wellness_manager": "wellness_manager",
            }
        )

    # managers → orchestrator
    g.add_edge("medical_manager",  "orchestrator")
    g.add_edge("wellness_manager", "orchestrator")

    # orchestrator → END
    g.add_edge("orchestrator", END)

    return g.compile()
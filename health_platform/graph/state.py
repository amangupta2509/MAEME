from typing import TypedDict, Annotated, Optional
from langgraph.graph.message import add_messages


class HealthState(TypedDict):
    # ── Identity ──────────────────────────────────────────
    user_id:            str               # unique user identifier
    stakeholder_type:   str               # user | dietician | wellness_expert | clinician

    # ── Conversation ──────────────────────────────────────
    messages:           Annotated[list, add_messages]   # full chat history
    current_query:      str               # latest raw user message

    # ── Routing ───────────────────────────────────────────
    query_category:     Optional[str]     # clinical | nutrition | exercise | report_submission | habits
    routed_to:          Optional[str]     # which expert agent received this query
    is_valid_query:     bool              # False = out of scope, companion should redirect

    # ── Expert Agent Outputs ──────────────────────────────
    diet_response:      Optional[str]
    wellness_response:  Optional[str]
    clinical_response:  Optional[str]
    behaviour_data:     Optional[dict]
    report_data:        Optional[dict]

    # ── Orchestration ─────────────────────────────────────
    orchestrator_decision:  Optional[str]   # which brain to use: moe | orion
    final_response:         Optional[str]   # compiled answer back to companion

    # ── Clinical Summary ──────────────────────────────────
    clinical_summary:   Optional[str]       # running clinical summary for this user
    clinical_approved:  bool                # clinician has reviewed and approved

    # ── Guardrail ─────────────────────────────────────────
    audit_flag:         bool                # True = something suspicious detected
    audit_notes:        Optional[str]       # auditor's notes if flagged

    # ── Report / DB ───────────────────────────────────────
    db_push_ready:      bool                # report manager verified, safe to push
    db_push_done:       bool                # pushed to DB successfully


def get_initial_state(user_id: str, stakeholder_type: str, query: str) -> HealthState:
    """
    Factory function — creates a fresh state for every new conversation turn.
    """
    return HealthState(
        user_id=user_id,
        stakeholder_type=stakeholder_type,
        messages=[],
        current_query=query,
        query_category=None,
        routed_to=None,
        is_valid_query=True,
        diet_response=None,
        wellness_response=None,
        clinical_response=None,
        behaviour_data=None,
        report_data=None,
        orchestrator_decision=None,
        final_response=None,
        clinical_summary=None,
        clinical_approved=False,
        audit_flag=False,
        audit_notes=None,
        db_push_ready=False,
        db_push_done=False,
    )
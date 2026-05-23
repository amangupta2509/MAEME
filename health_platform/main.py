"""
main.py — Entry point for the AI Health Platform.
Run this file to start an interactive session with any stakeholder.
"""
from graph.master_graph import run_health_platform
from config.settings import STAKEHOLDERS, DEBUG


def print_result(result: dict):
    print("\n" + "="*60)
    print("PLATFORM RESPONSE")
    print("="*60)
    print(f"Category   : {result.get('query_category') or 'out_of_scope'}")
    print(f"Routed to  : {result.get('routed_to') or 'none'}")
    print(f"Brain used : {result.get('orchestrator_decision') or 'none'}")
    print(f"Audit flag : {result.get('audit_flag')}")
    print(f"DB ready   : {result.get('db_push_ready')}")
    print(f"Approved   : {result.get('clinical_approved')}")
    print("-"*60)
    print("RESPONSE:")
    print(result.get("final_response", "No response generated."))
    print("="*60 + "\n")


def interactive_session():
    print("\n" + "="*60)
    print("  AI HEALTH PLATFORM — Multi-Agent System")
    print("="*60)
    print("Stakeholder types:")
    for i, s in enumerate(STAKEHOLDERS, 1):
        print(f"  {i}. {s}")

    stakeholder = input("\nEnter your stakeholder type (or press Enter for 'user'): ").strip()
    if stakeholder not in STAKEHOLDERS:
        stakeholder = "user"

    user_id = input("Enter your user ID (or press Enter for 'default_user'): ").strip()
    if not user_id:
        user_id = "default_user"

    clinical_summary = input("Enter existing clinical summary (or press Enter to skip): ").strip()
    if not clinical_summary:
        clinical_summary = None

    print(f"\n✅ Session started — Stakeholder: {stakeholder} | User: {user_id}")
    print("Type 'exit' to quit.\n")

    while True:
        query = input("You: ").strip()
        if not query:
            continue
        if query.lower() in ("exit", "quit", "q"):
            print("Session ended.")
            break

        print("\n⏳ Processing...")
        result = run_health_platform(
            user_id=user_id,
            stakeholder_type=stakeholder,
            query=query,
            clinical_summary=clinical_summary,
        )
        print_result(result)


def single_query(
    user_id: str,
    stakeholder_type: str,
    query: str,
    clinical_summary: str = None,
):
    """Run a single query programmatically — useful for API integration."""
    return run_health_platform(
        user_id=user_id,
        stakeholder_type=stakeholder_type,
        query=query,
        clinical_summary=clinical_summary,
    )


if __name__ == "__main__":
    interactive_session()
"""
Test the multi-agent debate system.
Tests 3 scenarios:
1. Normal debate — agents agree
2. Conflict debate — diet vs wellness conflict
3. Safety block — clinical expert blocks unsafe recommendation
"""
from graph.state import get_initial_state
from agents.experts.diet_expert       import diet_expert_node
from agents.experts.wellness_expert   import wellness_expert_node
from agents.experts.clinical_expert   import clinical_expert_node
from agents.orchestration.debate_agent import debate_node

CLINICAL_SUMMARY = "Patient: 45yo male, Type 2 Diabetes, Hypertension, BMI 29, recent knee surgery."

DEBATE_TESTS = [
    {
        "label":   "Normal Debate — Diabetic diet + exercise plan",
        "query":   "I have diabetes. What should I eat and what exercise can I do?",
        "stake":   "user",
    },
    {
        "label":   "Conflict Debate — High protein diet vs kidney concern",
        "query":   "I want to do a high protein diet and intense weight training.",
        "stake":   "user",
    },
    {
        "label":   "Safety Block — Post surgery intense exercise",
        "query":   "I just had knee surgery 2 days ago. Can I do intense running?",
        "stake":   "user",
    },
]

def run_debate_tests():
    print("=" * 60)
    print("MULTI-AGENT DEBATE TEST SUITE")
    print("=" * 60)

    for i, t in enumerate(DEBATE_TESTS, 1):
        print(f"\n{'─'*60}")
        print(f"TEST {i}: {t['label']}")
        print(f"QUERY: {t['query']}")
        print(f"{'─'*60}")

        # setup state
        state = get_initial_state(
            user_id=f"debate_user_{i}",
            stakeholder_type=t["stake"],
            query=t["query"],
        )
        state["clinical_summary"] = CLINICAL_SUMMARY

        # run all 3 experts first to get initial positions
        print("\n[Getting expert positions...]")
        state = diet_expert_node(state)
        state = wellness_expert_node(state)
        state = clinical_expert_node(state)

        print(f"Diet Expert:     {str(state.get('diet_response',''))[:80]}...")
        print(f"Wellness Expert: {str(state.get('wellness_response',''))[:80]}...")
        print(f"Clinical Expert: {str(state.get('clinical_response',''))[:80]}...")

        # run debate
        print("\n[Running debate...]")
        state = debate_node(state)

        print(f"\n{'='*40}")
        print("DEBATE CONSENSUS:")
        print(state.get("final_response", "No consensus reached.")[:500])
        print(f"\nAUDIT FLAG: {state.get('audit_flag')}")
        print(f"AUDIT NOTES: {str(state.get('audit_notes',''))[:100]}")

    print(f"\n{'='*60}")
    print("DEBATE TESTS COMPLETE")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    run_debate_tests()
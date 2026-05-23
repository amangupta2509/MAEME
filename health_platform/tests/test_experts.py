from graph.state import get_initial_state
from agents.experts.diet_expert       import diet_expert_node
from agents.experts.wellness_expert   import wellness_expert_node
from agents.experts.clinical_expert   import clinical_expert_node
from agents.experts.behaviour_tracker import behaviour_tracker_node
from agents.experts.report_manager    import report_manager_node

TESTS = [
    {
        "name":    "Diet Expert",
        "node":    diet_expert_node,
        "output":  "diet_response",
        "query":   "Patient is diabetic with high cholesterol. Suggest a diet plan.",
        "stake":   "dietician",
    },
    {
        "name":    "Wellness Expert",
        "node":    wellness_expert_node,
        "output":  "wellness_response",
        "query":   "Design a physiotherapy plan for a patient recovering from knee surgery.",
        "stake":   "wellness_expert",
    },
    {
        "name":    "Clinical Expert",
        "node":    clinical_expert_node,
        "output":  "clinical_response",
        "query":   "Patient reports persistent chest pain, shortness of breath, and fatigue for 3 days.",
        "stake":   "clinician",
    },
    {
        "name":    "Behaviour Tracker",
        "node":    behaviour_tracker_node,
        "output":  "behaviour_data",
        "query":   "Patient sleeps at 3am, wakes at 6am, skips breakfast daily, and reports high stress.",
        "stake":   "user",
    },
    {
        "name":    "Report Manager",
        "node":    report_manager_node,
        "output":  "report_data",
        "query":   "Patient uploaded blood test: HbA1c 8.2%, Fasting glucose 180mg/dL, LDL 160mg/dL.",
        "stake":   "clinician",
    },
]

def run_tests():
    print("=" * 60)
    print("EXPERT AGENT TEST SUITE")
    print("=" * 60)

    for t in TESTS:
        print(f"\n{'─'*60}")
        print(f"EXPERT : {t['name']}")
        print(f"QUERY  : {t['query'][:70]}...")

        state = get_initial_state(
            user_id="test_user_01",
            stakeholder_type=t["stake"],
            query=t["query"],
        )
        # inject a sample clinical summary for context
        state["clinical_summary"] = "Patient: 45yo male, Type 2 Diabetes, Hypertension, BMI 29."

        result = t["node"](state)

        output = result.get(t["output"])
        if isinstance(output, dict):
            output = output.get("raw_analysis") or output.get("raw_report") or str(output)

        print(f"OUTPUT :\n{output[:300]}...")

        # extra checks
        if t["name"] == "Clinical Expert":
            print(f"APPROVED: {result.get('clinical_approved')}")
        if t["name"] == "Behaviour Tracker":
            print(f"AUDIT FLAG: {result.get('audit_flag')}")
        if t["name"] == "Report Manager":
            print(f"DB READY: {result.get('db_push_ready')}")

    print(f"\n{'='*60}")
    print("ALL EXPERT TESTS COMPLETE")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    run_tests()
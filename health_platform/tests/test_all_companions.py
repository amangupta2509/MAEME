from graph.state import get_initial_state
from agents.companions.user_companion       import user_companion_node
from agents.companions.dietician_companion  import dietician_companion_node
from agents.companions.wellness_companion   import wellness_companion_node
from agents.companions.clinician_companion  import clinician_companion_node

# ── Test cases per companion ───────────────────────────────────────────────────
TESTS = {
    "USER (Aria)": {
        "node": user_companion_node,
        "stakeholder": "user",
        "cases": [
            ("I have chest pain since morning",          "clinical"),
            ("What should I eat if I am diabetic?",      "nutrition"),
            ("Give me a 20 min home workout",            "exercise"),
            ("Book me a flight to Dubai",                "out_of_scope"),
        ]
    },
    "DIETICIAN (Nova)": {
        "node": dietician_companion_node,
        "stakeholder": "dietician",
        "cases": [
            ("My patient has high cholesterol, suggest a diet plan", "nutrition"),
            ("Patient wants to track their meal habits",             "habits"),
            ("What is the capital of France?",                       "out_of_scope"),
        ]
    },
    "WELLNESS (Zen)": {
        "node": wellness_companion_node,
        "stakeholder": "wellness_expert",
        "cases": [
            ("Design a physiotherapy plan for knee pain",   "exercise"),
            ("Patient sleeps only 5 hours, any concern?",   "habits"),
            ("Tell me a joke",                              "out_of_scope"),
        ]
    },
    "CLINICIAN (Atlas)": {
        "node": clinician_companion_node,
        "stakeholder": "clinician",
        "cases": [
            ("Patient shows symptoms of Type 2 diabetes",       "clinical"),
            ("Summarise the patient's last blood report",       "report_submission"),
            ("What movies are showing this weekend?",           "out_of_scope"),
        ]
    },
}

def run_all():
    for companion_name, config in TESTS.items():
        print(f"\n{'='*60}")
        print(f"COMPANION: {companion_name}")
        print(f"{'='*60}")

        for i, (query, expected) in enumerate(config["cases"], 1):
            state = get_initial_state(
                user_id=f"test_{i}",
                stakeholder_type=config["stakeholder"],
                query=query,
            )
            result = config["node"](state)

            category = result.get("query_category") or "out_of_scope"
            is_valid = result.get("is_valid_query", False)
            routed   = result.get("routed_to", "none")
            response = result.get("final_response", "")
            passed   = "✅" if category == expected else "❌"

            print(f"\n{passed} Test {i}: {query}")
            print(f"   Expected : {expected}")
            print(f"   Got      : {category} | valid={is_valid} | routed={routed}")
            print(f"   Response : {response[:100]}...")

    print(f"\n{'='*60}")
    print("ALL COMPANION TESTS COMPLETE")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    run_all()
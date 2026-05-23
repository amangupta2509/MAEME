from graph.master_graph import run_health_platform

CLINICAL_SUMMARY = "Patient: 45yo male, Type 2 Diabetes, Hypertension, BMI 29."

TESTS = [
    {
        "label":       "User — Clinical query (chest pain)",
        "user_id":     "user_001",
        "stakeholder": "user",
        "query":       "I have been having chest pain and shortness of breath since yesterday.",
    },
    {
        "label":       "User — Nutrition query (diabetic diet)",
        "user_id":     "user_001",
        "stakeholder": "user",
        "query":       "What should I eat for breakfast given my diabetes?",
    },
    {
        "label":       "Dietician — Patient diet plan",
        "user_id":     "dietician_001",
        "stakeholder": "dietician",
        "query":       "My patient has high LDL and diabetes. Suggest a structured meal plan.",
    },
    {
        "label":       "Wellness — Physiotherapy plan",
        "user_id":     "wellness_001",
        "stakeholder": "wellness_expert",
        "query":       "Design a 4-week physiotherapy plan for post-knee-surgery recovery.",
    },
    {
        "label":       "Clinician — Blood report review",
        "user_id":     "clinician_001",
        "stakeholder": "clinician",
        "query":       "Patient uploaded blood test: HbA1c 9.1%, Fasting glucose 210mg/dL.",
    },
    {
        "label":       "User — Out of scope",
        "user_id":     "user_002",
        "stakeholder": "user",
        "query":       "Can you book me a flight to Dubai?",
    },
]

def run_e2e():
    print("=" * 60)
    print("END-TO-END MASTER GRAPH TEST")
    print("=" * 60)

    for i, t in enumerate(TESTS, 1):
        print(f"\n{'─'*60}")
        print(f"TEST {i}: {t['label']}")
        print(f"STAKEHOLDER: {t['stakeholder']}")
        print(f"QUERY: {t['query'][:70]}...")

        result = run_health_platform(
            user_id=t["user_id"],
            stakeholder_type=t["stakeholder"],
            query=t["query"],
            clinical_summary=CLINICAL_SUMMARY,
        )

        print(f"\nCATEGORY  : {result.get('query_category') or 'out_of_scope'}")
        print(f"ROUTED TO : {result.get('routed_to') or 'none'}")
        print(f"BRAIN     : {result.get('orchestrator_decision') or 'none'}")
        print(f"AUDIT FLAG: {result.get('audit_flag')}")
        print(f"AUDIT NOTE: {str(result.get('audit_notes', ''))[:80]}")
        print(f"DB READY  : {result.get('db_push_ready')}")
        print(f"APPROVED  : {result.get('clinical_approved')}")
        print(f"\nFINAL RESPONSE:\n{str(result.get('final_response', ''))[:300]}...")

    print(f"\n{'='*60}")
    print("END-TO-END TESTS COMPLETE")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    run_e2e()
from graph.companion_graph import run_user_companion

# ── Test queries covering all categories + out of scope ───────────────────────
test_cases = [
    {"query": "I have been feeling chest pain since morning",          "expect": "clinical"},
    {"query": "What should I eat for breakfast if I am diabetic?",     "expect": "nutrition"},
    {"query": "Give me a 20 minute home workout plan",                 "expect": "exercise"},
    {"query": "I want to upload my blood test report",                 "expect": "report_submission"},
    {"query": "I slept only 4 hours last night, is that bad?",        "expect": "habits"},
    {"query": "Can you book me a flight to Dubai?",                    "expect": "out_of_scope"},
    {"query": "Tell me a joke",                                        "expect": "out_of_scope"},
]

def run_tests():
    print("=" * 60)
    print("USER COMPANION TEST SUITE")
    print("=" * 60)

    for i, tc in enumerate(test_cases, 1):
        print(f"\nTest {i}: {tc['query']}")
        print(f"Expected category: {tc['expect']}")

        result = run_user_companion(
            user_id=f"test_user_{i}",
            query=tc["query"],
        )

        category = result.get("query_category") or "out_of_scope"
        response = result.get("final_response", "")
        routed   = result.get("routed_to", "none")
        valid    = result.get("is_valid_query", False)

        print(f"Got category    : {category}")
        print(f"Is valid        : {valid}")
        print(f"Routed to       : {routed}")
        print(f"Response preview: {response[:120]}...")
        print("-" * 60)

if __name__ == "__main__":
    run_tests()
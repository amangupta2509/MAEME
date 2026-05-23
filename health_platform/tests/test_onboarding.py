"""
Test onboarding + MemPalace flow.
Simulates a new user going through onboarding then asking questions.
"""
import os
from demo.demo_mode import DemoSession

# use a fresh test user ID
TEST_USER = "test_investor_001"

# clean up old profile if exists (fresh start)
profile_path = f"demo/mempalace/{TEST_USER}.json"
if os.path.exists(profile_path):
    os.remove(profile_path)
    print(f"[Test] Cleared old profile for {TEST_USER}")

session = DemoSession()

# simulate conversation
conversation = [
    # onboarding answers
    None,           # triggers first question
    "1",            # food preference: vegetarian
    "Dal rice, Paneer dishes, Salads",  # favourite foods
    "Peanuts",      # allergies
    "Knee pain",    # physical limitation
    # now normal chat
    "What should I eat for breakfast",
    "Give me lunch suggestion",
    "veg food for dinner",
    "Exercise",
    "Wellness tips",
    "Book me a flight",
    "Change lunch",
]

print("\n" + "="*55)
print("ONBOARDING + MEMPALACE TEST")
print("="*55 + "\n")

for i, user_msg in enumerate(conversation):
    if user_msg is None:
        # first message triggers onboarding
        response = session.chat("Hello", user_id=TEST_USER)
    else:
        response = session.chat(user_msg, user_id=TEST_USER)

    if user_msg:
        print(f"You: {user_msg}")
    else:
        print("You: Hello")
    print(f"Assistant:\n{response}")
    print("-" * 55)
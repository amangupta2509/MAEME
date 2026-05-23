"""
Onboarding Agent — collects user preferences before first interaction.
Stores everything in MemPalace under user_id.
Returning users skip onboarding — loaded directly from MemPalace.
"""
import json
import os
from datetime import datetime

# ── MemPalace storage (simple file-based for demo — no ChromaDB needed) ───────
MEMPALACE_DIR = "demo/mempalace"

def _user_file(user_id: str) -> str:
    os.makedirs(MEMPALACE_DIR, exist_ok=True)
    return os.path.join(MEMPALACE_DIR, f"{user_id}.json")

def save_user_profile(user_id: str, profile: dict):
    """Save user profile to MemPalace."""
    profile["user_id"]    = user_id
    profile["created_at"] = datetime.now().isoformat()
    with open(_user_file(user_id), "w") as f:
        json.dump(profile, f, indent=2)
    print(f"[MemPalace] Saved profile for user={user_id}")

def load_user_profile(user_id: str) -> dict | None:
    """Load user profile from MemPalace. Returns None if new user."""
    path = _user_file(user_id)
    if not os.path.exists(path):
        return None
    with open(path, "r") as f:
        return json.load(f)

def is_new_user(user_id: str) -> bool:
    return not os.path.exists(_user_file(user_id))

def update_user_profile(user_id: str, updates: dict):
    """Update specific fields in an existing profile."""
    profile = load_user_profile(user_id) or {}
    profile.update(updates)
    save_user_profile(user_id, profile)


# ── Onboarding conversation state ─────────────────────────────────────────────
class OnboardingAgent:
    """
    Manages the onboarding conversation.
    Asks 4 questions, collects answers, saves to MemPalace.
    """

    QUESTIONS = [
        {
            "key":      "food_preference",
            "question": (
                "Welcome! 👋 I'm your personal AI health assistant.\n\n"
                "Before we get started, I'd love to personalise your experience.\n\n"
                "**What is your food preference?**\n"
                "1️⃣ Vegetarian\n"
                "2️⃣ Non-Vegetarian\n"
                "3️⃣ Both (I eat everything)\n\n"
                "Please reply with 1, 2, or 3 — or just type your preference."
            ),
            "parse": lambda ans: {
                "1": "vegetarian", "vegetarian": "vegetarian", "veg": "vegetarian",
                "2": "non_vegetarian", "non-vegetarian": "non_vegetarian",
                "non veg": "non_vegetarian", "nonveg": "non_vegetarian",
                "chicken": "non_vegetarian", "meat": "non_vegetarian",
                "3": "both", "both": "both", "everything": "both",
            }.get(ans.strip().lower(), ans.strip().lower()),
        },
        {
            "key":      "favourite_foods",
            "question": (
                "Great! 🍽️\n\n"
                "**What are your favourite foods?**\n"
                "For example: Dal rice, Paneer dishes, Fruits, Salads...\n\n"
                "Just tell me what you enjoy eating!"
            ),
            "parse": lambda ans: ans.strip(),
        },
        {
            "key":      "allergies",
            "question": (
                "Got it! 😊\n\n"
                "**Do you have any food allergies or foods you want to avoid?**\n"
                "For example: Peanuts, Dairy, Gluten, Shellfish...\n\n"
                "If none, just say **'No allergies'**."
            ),
            "parse": lambda ans: (
                [] if any(w in ans.lower() for w in ["no", "none", "nothing", "nope"])
                else [a.strip() for a in ans.replace("and", ",").split(",")]
            ),
        },
        {
            "key":      "physical_limitations",
            "question": (
                "Almost done! 💪\n\n"
                "**Do you have any injuries or physical limitations?**\n"
                "For example: Knee pain, Back pain, Recent surgery...\n\n"
                "This helps me suggest safe exercises for you.\n"
                "If none, just say **'No limitations'**."
            ),
            "parse": lambda ans: (
                "none" if any(w in ans.lower() for w in ["no", "none", "nothing", "nope"])
                else ans.strip()
            ),
        },
    ]

    def __init__(self, user_id: str):
        self.user_id  = user_id
        self.step     = 0
        self.answers  = {}
        self.complete = False

    def get_next_question(self) -> str:
        if self.step < len(self.QUESTIONS):
            return self.QUESTIONS[self.step]["question"]
        return None

    def process_answer(self, answer: str) -> str:
        """Process user's answer to current question. Returns next question or completion message."""
        if self.step >= len(self.QUESTIONS):
            self.complete = True
            return self._complete_onboarding()

        # parse and store answer
        q = self.QUESTIONS[self.step]
        self.answers[q["key"]] = q["parse"](answer)
        self.step += 1

        # check if all questions answered
        if self.step >= len(self.QUESTIONS):
            self.complete = True
            return self._complete_onboarding()

        # return next question
        return self.QUESTIONS[self.step]["question"]

    def _complete_onboarding(self) -> str:
        """Save profile and return completion message."""
        profile = {
            "food_preference":      self.answers.get("food_preference", "both"),
            "favourite_foods":      self.answers.get("favourite_foods", ""),
            "allergies":            self.answers.get("allergies", []),
            "physical_limitations": self.answers.get("physical_limitations", "none"),
            "conditions":           "",   # filled by clinical data later
            "onboarding_complete":  True,
        }
        save_user_profile(self.user_id, profile)

        pref = profile["food_preference"].replace("_", "-").title()
        return (
            f"Perfect! 🎉 Your profile is all set!\n\n"
            f"Here's what I've saved for you:\n"
            f"🥗 Food preference: **{pref}**\n"
            f"❤️ Favourite foods: {self.answers.get('favourite_foods', 'N/A')}\n"
            f"⚠️ Allergies to avoid: {', '.join(profile['allergies']) if profile['allergies'] else 'None'}\n"
            f"🦵 Physical limitations: {profile['physical_limitations']}\n\n"
            f"I'll use this to personalise all my suggestions for you.\n\n"
            f"Now, what would you like help with?\n"
            f"🍽️ Meals  |  🏃 Exercise  |  🌿 Wellness"
        )
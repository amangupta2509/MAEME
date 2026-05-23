"""
DEMO MODE — with Onboarding + MemPalace memory.
Flow:
  New user  → Onboarding Agent (4 questions) → save to MemPalace
  Old user  → load from MemPalace → answer directly
  All users → DB first → Qwen fallback → never wrong food
"""
import json
import os
import random
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from config.settings import QWEN_API_KEY, QWEN_BASE_URL
from demo.onboarding_agent import (
    OnboardingAgent, load_user_profile,
    save_user_profile, is_new_user
)
from demo.mempalace_bridge import save_interaction

DB_PATH = "demo/health_db.json"

def load_db() -> dict:
    with open(DB_PATH, "r") as f:
        return json.load(f)


# ── Intent detection ──────────────────────────────────────────────────────────
def detect_intent(query: str) -> dict:
    q = query.lower().strip()
    intent = {
        "type":           "unknown",
        "meal_slot":      None,
        "veg_override":   None,
        "exercise_type":  None,
        "wellness_topic": None,
        "want_other":     False,
    }

    if any(w in q for w in ["hello","hi","hey","good morning","good evening","start","help","welcome"]):
        intent["type"] = "greeting"
        return intent

    # social / acknowledgement
    if any(w in q for w in ["thank","thanks","thank you","great","awesome","perfect","nice","good","ok","okay","cool","got it","understood"]):
        intent["type"] = "social"
        return intent

    out_keywords = ["flight","book hotel","movie","cricket","stock","weather",
                    "news","politics","game","music","joke","math","code","whatsapp"]
    if any(w in q for w in out_keywords):
        intent["type"] = "out_of_scope"
        return intent

    if any(w in q for w in ["veg ","vegetarian","no meat","plant based","veg food","only veg"]):
        intent["veg_override"] = "vegetarian"
    elif any(w in q for w in ["non veg","nonveg","chicken","fish","egg","meat","tuna","salmon"]):
        intent["veg_override"] = "non_vegetarian"

    if any(w in q for w in ["another","other","change","different","alternative","switch","else","more option","next"]):
        intent["want_other"] = True

    if any(w in q for w in ["exercise","workout","yoga","walk","swim","cycling",
                             "fitness","cardio","activity","gym","stretching","physical"]):
        intent["type"] = "exercise"
        intent["exercise_type"] = "moderate" if any(w in q for w in ["moderate","intense","cycling","yoga"]) else "low_impact"
        return intent

    if any(w in q for w in ["sleep","stress","water","hydrat","mental","relax",
                             "blood sugar","pressure","wellness","tips","lifestyle"]):
        intent["type"] = "wellness"
        if "sleep" in q:           intent["wellness_topic"] = "sleep"
        elif "stress" in q:        intent["wellness_topic"] = "stress"
        elif "water" in q or "hydrat" in q: intent["wellness_topic"] = "hydration"
        elif "blood sugar" in q:   intent["wellness_topic"] = "blood sugar"
        return intent

    diet_keywords = ["eat","food","meal","breakfast","lunch","dinner","snack",
                     "cook","recipe","diet","nutrition","hungry","have","suggest",
                     "recommend","morning","evening","night","what should"]
    if any(w in q for w in diet_keywords):
        intent["type"] = "diet"
        if any(w in q for w in ["breakfast","morning"]): intent["meal_slot"] = "breakfast"
        elif any(w in q for w in ["lunch","midday","noon"]): intent["meal_slot"] = "lunch"
        elif any(w in q for w in ["dinner","night","supper"]): intent["meal_slot"] = "dinner"
        elif any(w in q for w in ["snack","evening","tea time"]): intent["meal_slot"] = "snack"
        else: intent["meal_slot"] = "lunch"
        return intent

    intent["type"] = "diet"
    intent["meal_slot"] = "lunch"
    return intent


# ── Format helpers ────────────────────────────────────────────────────────────
SLOT_INTROS = {
    "breakfast": "Here's a great breakfast to start your day right! 🌅",
    "lunch":     "Here's a balanced lunch crafted for your health goals! 🥗",
    "dinner":    "Here's a nourishing dinner to end your day well! 🌙",
    "snack":     "Here's a healthy snack to keep you energized! ⚡",
}

def format_meal(meal: dict, slot: str) -> str:
    intro = SLOT_INTROS.get(slot, "Here's your meal suggestion! 🍽️")
    r  = f"{intro}\n\n🍽️ {meal['name']}\n"
    r += f"📊 Nutrition: {meal['kcal']} kcal | Protein: {meal['protein']} | Carbs: {meal['carbs']} | Fat: {meal['fat']}\n\n"
    r += "🛒 Ingredients:\n" + "".join(f"- {i}\n" for i in meal["ingredients"])
    r += "\n👨‍🍳 Steps:\n" + "".join(f"{i+1}. {s}\n" for i, s in enumerate(meal["steps"]))
    r += f"\n💊 Clinical Note: {meal['clinical_note']}"
    return r

def format_exercise(ex: dict) -> str:
    r  = f"Here's your personalized exercise plan! 💪\n\n"
    r += f"🏃 {ex['name']}\n"
    r += f"⏱️ Duration: {ex['duration']} | 💪 Intensity: {ex['intensity']} | 🔥 ~{ex['kcal']} kcal burned\n\n"
    r += "📋 How to do it:\n" + "".join(f"{i+1}. {s}\n" for i, s in enumerate(ex["steps"]))
    r += f"\n💊 Clinical Note: {ex['clinical_note']}"
    return r

def format_wellness(tip: dict) -> str:
    r  = f"Here's a wellness tip for you! 🌿\n\n💡 {tip['tip']}\n\n"
    r += "✅ Action Steps:\n" + "".join(f"- {a}\n" for a in tip["actions"])
    return r


# ── Main Demo Session ─────────────────────────────────────────────────────────
class DemoSession:
    def __init__(self):
        self.db          = load_db()
        self.sessions    = {}   # user_id → {"onboarding": OnboardingAgent, "profile": dict, "last_shown": dict}
        self.llm = ChatOpenAI(
            model="qwen2.5-14b",
            api_key=QWEN_API_KEY,
            base_url=QWEN_BASE_URL,
            temperature=0.4,
            max_tokens=None,
            extra_body={"max_tokens": 600},
        )
        print("✅ DemoSession ready — Onboarding + MemPalace active")

    def _get_session(self, user_id: str) -> dict:
        if user_id not in self.sessions:
            self.sessions[user_id] = {
                "onboarding": None,
                "profile":    load_user_profile(user_id),
                "last_shown": {},
            }
        return self.sessions[user_id]

    def _get_pref(self, user_id: str, override: str = None) -> str:
        """Resolve food preference — override → MemPalace → default veg."""
        if override:
            return override
        sess    = self._get_session(user_id)
        profile = sess.get("profile") or {}
        pref    = profile.get("food_preference", "vegetarian")
        # map to db keys
        return "non_veg" if "non" in pref else "veg"

    def _filter_allergies(self, items: list, user_id: str) -> list:
        sess      = self._get_session(user_id)
        profile   = sess.get("profile") or {}
        allergies = [a.lower() for a in profile.get("allergies", [])]
        if not allergies:
            return items
        safe = []
        for item in items:
            ings = " ".join(item.get("ingredients", [])).lower()
            name = item["name"].lower()
            if not any(a in ings or a in name for a in allergies):
                safe.append(item)
        return safe

    def _filter_disability(self, items: list, user_id: str) -> list:
        sess      = self._get_session(user_id)
        profile   = sess.get("profile") or {}
        disability = profile.get("physical_limitations", "none").lower()
        if disability == "none":
            return items
        safe = []
        for item in items:
            avoid = " ".join(item.get("avoid_for", [])).lower()
            if not any(word in avoid for word in disability.split() if len(word) > 3):
                safe.append(item)
        return safe

    def _get_next_item(self, items: list, key: str, user_id: str) -> dict:
        sess = self._get_session(user_id)
        if not items:
            return None
        idx = (sess["last_shown"].get(key, -1) + 1) % len(items)
        sess["last_shown"][key] = idx
        return items[idx]

    def _qwen_generate(self, request: str, user_id: str) -> str:
        sess    = self._get_session(user_id)
        profile = sess.get("profile") or {}
        pref    = profile.get("food_preference", "vegetarian")
        allergy = ", ".join(profile.get("allergies", [])) or "none"
        limit   = profile.get("physical_limitations", "none")
        conditions = profile.get("conditions", "diabetes, hypertension")

        prompt = f"""You are a health assistant. Answer this request:
REQUEST: {request}

Patient profile (MUST follow strictly):
- Conditions: {conditions}
- Food preference: {pref} (STRICTLY follow this — never suggest food against this preference)
- Allergies (NEVER include these): {allergy}
- Physical limitation: {limit}

IMPORTANT: If food preference is vegetarian — suggest ONLY vegetarian food. No meat, no fish, no chicken, no beef, no pork.

For meals format:
🍽️ [Name]
📊 Nutrition: X kcal | Protein: Xg | Carbs: Xg | Fat: Xg
🛒 Ingredients:
- item: quantity
👨‍🍳 Steps:
1. step
💊 Clinical Note: brief

For exercise format:
🏃 [Name]
⏱️ Duration: X | 💪 Intensity: X | 🔥 ~X kcal
Steps + clinical note.

Start directly with emoji. No preamble."""

        result = self.llm.invoke([HumanMessage(content=prompt)])
        return result.content.strip()

    def chat(self, user_input: str, user_id: str = "default_user") -> str:
        sess = self._get_session(user_id)

        # ── ONBOARDING CHECK ──────────────────────────────────────────────────
        # new user — start onboarding
        if is_new_user(user_id) and sess["onboarding"] is None:
            agent = OnboardingAgent(user_id)
            sess["onboarding"] = agent
            return agent.get_next_question()

        # onboarding in progress — process answer
        if sess["onboarding"] and not sess["onboarding"].complete:
            agent    = sess["onboarding"]
            response = agent.process_answer(user_input)
            if agent.complete:
                # reload profile from MemPalace
                sess["profile"]    = load_user_profile(user_id)
                sess["onboarding"] = None
            return response

        # ── NORMAL CHAT ───────────────────────────────────────────────────────
        intent = detect_intent(user_input)
        pref   = self._get_pref(user_id, intent.get("veg_override"))

        if intent["type"] == "greeting":
            greeting = "Hello! 👋 Great to see you!\n\nWhat would you like today?\n🍽️ Meals  |  🏃 Exercise  |  🌿 Wellness"
            return greeting

        if intent["type"] == "social":
            return "You're welcome! 😊 Happy to help. Is there anything else you'd like — meals, exercise, or wellness tips?"

        if intent["type"] == "out_of_scope":
            return (
                "I appreciate you reaching out! 😊\n\n"
                "I'm specialised in health, nutrition, and wellness guidance.\n"
                "I can't help with that, but I'd love to assist with:\n\n"
                "🍽️ Personalised meal suggestions\n"
                "🏃 Exercise recommendations\n"
                "🌿 Wellness and lifestyle tips\n\n"
                "What health question can I help you with?"
            )

        # ── Preference conflict check ──────────────────────────────────────────
        profile      = sess.get("profile") or {}
        saved_pref   = profile.get("food_preference", "vegetarian")
        is_saved_veg = "non" not in saved_pref.lower()
        q_lower      = user_input.lower()
        meat_words   = ["chicken","beef","mutton","pork","fish","tuna","salmon","prawn","shrimp","meat","lamb"]
        asked_meat   = any(w in q_lower for w in meat_words)

        if is_saved_veg and asked_meat:
            return (
                "🥗 Your profile is set to **Vegetarian** food preference.\n\n"
                "I can't suggest non-vegetarian options for you.\n"
                "Would you like me to suggest a delicious vegetarian alternative instead?\n\n"
                "Just say **'Yes'** or ask for any meal! 😊"
            )

        if not is_saved_veg and intent.get("veg_override") == "vegetarian":
            return (
                "🍗 Your profile is set to **Non-Vegetarian** food preference.\n\n"
                "I can suggest non-vegetarian options that suit your health goals.\n"
                "Would you like a non-vegetarian meal suggestion instead?\n\n"
                "Just say **'Yes'** or ask for any meal! 😊"
            )

        if intent["type"] == "diet":
            slot  = intent["meal_slot"] or "lunch"
            pref  = self._get_pref(user_id, intent.get("veg_override"))

            # check if user asked for a specific food by name
            all_items = []
            for s in ["breakfast","lunch","dinner","snack"]:
                all_items += self.db["diet"].get(s, {}).get(pref, [])
            all_items = self._filter_allergies(all_items, user_id)

            # search for specific food name in query
            q_lower   = user_input.lower()
            named_match = None
            for item in all_items:
                if any(word in q_lower for word in item["name"].lower().split()):
                    named_match = item
                    # find which slot this item belongs to
                    for s in ["breakfast","lunch","dinner","snack"]:
                        if item in self.db["diet"].get(s, {}).get(pref, []):
                            slot = s
                    break

            if named_match:
                return format_meal(named_match, slot)

            # no specific food named — use slot + cycle
            items = self.db["diet"].get(slot, {}).get(pref, [])
            items = self._filter_allergies(items, user_id)
            if items:
                key  = f"{slot}_{pref}_{user_id}"
                meal = self._get_next_item(items, key, user_id)
                return format_meal(meal, slot)
            else:
                return self._qwen_generate(
                    f"Suggest a {pref.replace('_',' ')} {slot} meal", user_id
                )

        if intent["type"] == "exercise":
            ex_type = intent["exercise_type"] or "low_impact"
            items   = self.db["exercise"].get(ex_type, [])
            items   = self._filter_disability(items, user_id)
            if items:
                key = f"exercise_{ex_type}_{user_id}"
                ex  = self._get_next_item(items, key, user_id)
                return format_exercise(ex)
            else:
                return self._qwen_generate(
                    f"Suggest a safe exercise for this patient", user_id
                )

        if intent["type"] == "wellness":
            topic = intent["wellness_topic"]
            tips  = self.db["wellness"]
            tip   = next((t for t in tips if t["topic"] == topic), None) if topic else random.choice(tips)
            return format_wellness(tip) if tip else self._qwen_generate("Give a wellness tip", user_id)

        response = self._qwen_generate(user_input, user_id)

        # ── Save interaction to MemPalace after every turn ────────────────────
        category = intent.get("type", "unknown") if "intent" in dir() else "unknown"
        save_interaction(user_id, user_input, response, category)

        return response


# ── CLI Runner ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    session = DemoSession()
    user_id = "cli_user_001"

    print("\n" + "="*55)
    print("  HEALTH PLATFORM — DEMO MODE (CLI)")
    print("="*55)
    print("Type 'exit' to quit.\n")

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nSession ended.")
            break
        if not user_input:
            continue
        if user_input.lower() in ("exit", "quit", "q"):
            print("Session ended.")
            break
        response = session.chat(user_input, user_id=user_id)
        print(f"\nAssistant:\n{response}\n")
        print("-" * 55)
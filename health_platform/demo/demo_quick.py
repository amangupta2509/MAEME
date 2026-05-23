"""
Demo Quick — entry point for server.py
Passes user_id so each user gets their own MemPalace profile.
Every response is automatically saved to MemPalace via demo_mode.
"""
from demo.demo_mode import DemoSession

_demo = DemoSession()

def quick_response(user_message: str, user_id: str = "demo_user") -> dict:
    """
    Runs user message through demo session.
    Internally saves interaction to MemPalace after every turn.
    This means nutritionist can later read full patient history.
    """
    response = _demo.chat(user_message, user_id=user_id)
    return {
        "response":   response,
        "category":   "demo",
        "audit_flag": False,
    }
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import os

load_dotenv()

# ── API Keys ──────────────────────────────────────────────
GOOGLE_API_KEY  = os.getenv("GOOGLE_API_KEY")
ORINN_API_KEY   = os.getenv("ORINN_API_KEY")
ORINN_BASE_URL  = os.getenv("ORINN_BASE_URL", "https://api-call.orinn.ai/v1")
QWEN_API_KEY    = os.getenv("QWEN_API_KEY", "dummy")
QWEN_BASE_URL   = os.getenv("QWEN_BASE_URL", "http://localhost:8000/v1")

# ── Model Names ───────────────────────────────────────────
COMPANION_MODEL = "qwen2.5-14b"           # all 4 companions → Qwen
CLINICAL_MODEL  = "Orinn-1.7"             # clinical expert + medical manager + auditor → Orinn
WELLNESS_MODEL  = "qwen2.5-14b"           # wellness + diet + behaviour → Qwen
ORCHESTRATOR_MODEL = "Orinn-1.7"          # orchestrator → Orinn
AUDITOR_MODEL   = "Orinn-1.7"             # guardrail auditor → Orinn

# ── Query Categories (routing buckets) ────────────────────
QUERY_CATEGORIES = [
    "clinical",
    "nutrition",
    "exercise",
    "report_submission",
    "habits",
]

# ── Stakeholder Types ─────────────────────────────────────
STAKEHOLDERS = [
    "user",
    "dietician",
    "wellness_expert",
    "clinician",
]

# ── App Settings ──────────────────────────────────────────
APP_ENV  = os.getenv("APP_ENV", "development")
DEBUG    = APP_ENV == "development"


# ── Orinn Client Factory (clinical + auditor) ─────────────
def get_orinn_llm(temperature: float = 0.3) -> ChatOpenAI:
    """
    Orinn-1.7 — used for clinical expert, medical manager,
    orchestrator, and guardrail auditor.
    """
    return ChatOpenAI(
        model=CLINICAL_MODEL,
        api_key=ORINN_API_KEY,
        base_url=ORINN_BASE_URL,
        temperature=temperature,
    )


# ── Qwen Client Factory (companions + non-clinical experts) ──
def get_qwen_llm(temperature: float = 0.3) -> ChatOpenAI:
    """
    Qwen2.5-14B via vLLM — OpenAI-compatible but uses max_tokens not max_completion_tokens.
    We disable the default max_tokens param and let vLLM use its own defaults.
    Requires SSH tunnel: ssh -L 8000:localhost:8000 dgx-i-molsys@210.212.207.65 -N
    """
    return ChatOpenAI(
        model="qwen2.5-14b",
        api_key=QWEN_API_KEY,
        base_url=QWEN_BASE_URL,
        temperature=temperature,
        max_tokens=None,          # disable LangChain's max_tokens
        extra_body={
            "max_tokens": 1024,   # pass directly to vLLM
        },
    )
# LLM Initialization Documentation

## Overview

The health platform uses **Qwen 2.5-14B** as the LLM for companions and non-clinical experts. The initialization spans two files with a factory pattern.

---

## 1. **base_companion.py** — Where LLM is Used

**File Path:** `agents/companions/base_companion.py`  
**Lines:** 72-73

```python
self.llm            = get_qwen_llm(temperature=0.3)
self.classifier_llm = get_qwen_llm(temperature=0.0)
```

**Context:**

- **Main LLM** (`self.llm`) — Used for generating responses with temperature 0.3
- **Classifier LLM** (`self.classifier_llm`) — Used for query classification with temperature 0.0 (deterministic)
- Both are instances of `ChatOpenAI`
- Function called: `get_qwen_llm()` from `config.settings`

---

## 2. **config/settings.py** — Where LLM is Initialized

**File Path:** `config/settings.py`  
**Lines:** 59-71

```python
def get_qwen_llm(temperature: float = 0.3) -> ChatOpenAI:
    """
    Qwen2.5-14B via vLLM — OpenAI-compatible but uses max_tokens not max_completion_tokens.
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
```

---

## Configuration Parameters

| Parameter       | Value                                 | Source                                          |
| --------------- | ------------------------------------- | ----------------------------------------------- |
| **model**       | `qwen2.5-14b`                         | Hardcoded                                       |
| **api_key**     | `QWEN_API_KEY`                        | `.env` (defaults to `"dummy"`)                  |
| **base_url**    | `QWEN_BASE_URL`                       | `.env` (defaults to `http://localhost:8000/v1`) |
| **temperature** | `0.3` (responses), `0.0` (classifier) | Function parameter                              |
| **max_tokens**  | `1024`                                | Via `extra_body` for vLLM                       |

---

## Environment Variables (from .env)

```
QWEN_API_KEY = "dummy"
QWEN_BASE_URL = "http://localhost:8000/v1"
```

---

## Related LLM Initializations

The platform also uses **Orinn-1.7** for clinical tasks:

**File:** `config/settings.py` (Lines 45-52)

```python
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
```

| Parameter    | Value            | Source                                              |
| ------------ | ---------------- | --------------------------------------------------- |
| **model**    | `Orinn-1.7`      | Defined as `CLINICAL_MODEL` in settings.py          |
| **api_key**  | `ORINN_API_KEY`  | `.env`                                              |
| **base_url** | `ORINN_BASE_URL` | `.env` (defaults to `https://api-call.orinn.ai/v1`) |

---

## Architecture Summary

```
base_companion.py
    ↓
    calls get_qwen_llm()
    ↓
config/settings.py
    ↓
    returns ChatOpenAI(model="qwen2.5-14b", ...)
```

All 4 companions (User, Clinician, Dietician, Wellness) use this same factory function.

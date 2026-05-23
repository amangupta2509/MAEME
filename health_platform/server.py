"""
server.py — Flask bridge for MAE|ME Health Platform.

Flow:
    React UI (localhost:5173)
        → POST localhost:5000/api/chat     [this server]
            → single_query()               [LangGraph agents + guardrails]
                → Qwen / Orinn via vLLM   [localhost:8000, already in .env]

Prerequisites:
    SSH tunnel must be active before starting:
    ssh -L 8000:localhost:8000 dgx-i-molsys@210.212.207.65 -N
"""

import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS

# Quick response mode
from demo.demo_quick import quick_response

# Document processing
from tools.mcp_file_server import process_document

# Nutritionist endpoints
from demo.mempalace_bridge import (
    load_patient_context_for_nutritionist,
    save_clinical_note,
    get_patient_summary,
)
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
import os

# Nutritionist LLM (Qwen)
_nutri_llm = ChatOpenAI(
    model="qwen2.5-14b",
    api_key=os.getenv("QWEN_API_KEY", "dummy"),
    base_url=os.getenv("QWEN_BASE_URL", "http://localhost:8000/v1"),
    temperature=0.3,
    max_tokens=None,
    extra_body={"max_tokens": 600},
)

NUTRITIONIST_SYSTEM_PROMPT = """
You are Nova, an AI assistant for a registered Nutritionist/Dietician.
You have been given the full context of a specific patient from their health memory.

YOUR ROLE:
- Help the nutritionist review and understand the patient's health data
- Suggest diet plan modifications based on patient conditions and preferences
- Flag nutritional concerns or conflicts
- Answer questions about the patient's diet, exercise, and wellness history
- Never give final clinical diagnoses — support the nutritionist's judgment

RULES:
- Always refer to the patient as "the patient" or "your patient"
- Use professional nutritional/medical terminology
- Base all recommendations on the patient context provided
- Be concise and actionable — the nutritionist is busy
- Never expose internal system details

Start directly with your answer. No preamble.
"""

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5000"])


# ── Health check ──────────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "pipeline": "agents + guardrails active"}), 200


# ── Nutritionist Chat Endpoint ────────────────────────────────────────────────
@app.route("/api/nutritionist/chat", methods=["POST"])
def nutritionist_chat():
    """
    Nutritionist chat — loads patient MemPalace context then calls LLM.
    Request:  { "message": "...", "patient_id": "arjun", "nutritionist_id": "nutri_demo" }
    Response: { "response": "...", "patient_context_loaded": true }
    """
    try:
        data            = request.get_json(force=True)
        message         = data.get("message", "").strip()
        patient_id      = data.get("patient_id", "")
        nutritionist_id = data.get("nutritionist_id", "nutritionist")

        if not message:
            return jsonify({"error": "No message provided"}), 400
        if not patient_id:
            return jsonify({"response": "Please select a patient first.", "patient_context_loaded": False}), 200

        print(f"\n[Nutritionist] {nutritionist_id} → patient={patient_id} | {message[:60]}")

        # load full patient context from MemPalace
        patient_context = load_patient_context_for_nutritionist(patient_id)
        context_loaded  = "Not onboarded" not in patient_context

        messages = [
            SystemMessage(content=NUTRITIONIST_SYSTEM_PROMPT),
            SystemMessage(content=f"PATIENT ID: {patient_id}\n\n{patient_context}"),
            HumanMessage(content=message),
        ]

        result   = _nutri_llm.invoke(messages)
        response = result.content.strip()

        # auto-save clinical note when nutritionist approves
        if any(w in message.lower() for w in ["approve", "approved", "confirm", "finalize"]):
            save_clinical_note(
                patient_id,
                f"Nutritionist note: {message[:100]}. AI response: {response[:200]}",
                written_by=nutritionist_id,
            )

        print(f"[Nutritionist] Response: {response[:80]}...")

        return jsonify({
            "response":               response,
            "patient_context_loaded": context_loaded,
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"response": "Error processing request.", "error": str(e)}), 500


# ── Nutritionist Patients List Endpoint ────────────────────────────────────────
@app.route("/api/nutritionist/patients", methods=["GET"])
def get_patients():
    """Returns patient list with MemPalace summary for nutritionist dashboard."""
    patient_ids = ["arjun", "cli_user_001", "test_investor_001"]
    patients = []
    for pid in patient_ids:
        summary = get_patient_summary(pid)
        patients.append(summary)
    return jsonify({"patients": patients}), 200


# ── Nutritionist Patient Detail Endpoint ───────────────────────────────────────
@app.route("/api/nutritionist/patient/<patient_id>", methods=["GET"])
def get_patient_detail(patient_id):
    """Returns full patient context for nutritionist to review."""
    context = load_patient_context_for_nutritionist(patient_id)
    summary = get_patient_summary(patient_id)
    return jsonify({
        "patient_id": patient_id,
        "summary":    summary,
        "context":    context,
    }), 200


# ── Nutritionist Save Note Endpoint ────────────────────────────────────────────
@app.route("/api/nutritionist/note", methods=["POST"])
def save_note():
    """Save a clinical note from nutritionist about a patient."""
    data       = request.get_json(force=True)
    patient_id = data.get("patient_id", "")
    note       = data.get("note", "")
    written_by = data.get("nutritionist_id", "nutritionist")
    if not patient_id or not note:
        return jsonify({"error": "patient_id and note required"}), 400
    save_clinical_note(patient_id, note, written_by)
    return jsonify({"status": "saved"}), 200


# ── Demo endpoint for investor presentation ───────────────────────────────────
@app.route("/api/demo/chat", methods=["POST"])
def demo_chat():
    """Demo endpoint using quick_response — for investor presentation."""
    data    = request.get_json(force=True)
    message = data.get("message", "").strip()
    user_id = data.get("user_id", "PT-001")
    if not message:
        return jsonify({"error": "No message"}), 400
    result = quick_response(message, user_id)
    return jsonify(result), 200


# ── Strip internal agent metadata from response text ─────────────────────────
def clean_response(text: str) -> str:
    import re

    # ── Remove lines that are pure internal metadata ──────────────────────────
    remove_line_patterns = [
        r"^#{1,6}\s*Option\s*\d+.*$",        # #### Option 1: Brisk Walking
        r"^CONSENSUS REACHED\s*:.*$",
        r"^OVERRIDES APPLIED\s*:.*$",
        r"^AUDIT STATUS\s*:.*$",
        r"^ISSUES FOUND\s*:.*$",
        r"^SAFETY CHECK\s*:.*$",
        r"^HALLUCINATION RISK\s*:.*$",
        r"^ESCALATION\s*:.*$",
        r"^ROUTED TO\s*:.*$",
        r"^DEBATE ROUND\s*:.*$",
        r"^---+$",                            # separator lines
        r"^💡\s*\*\*Clinical Insight:\*\*$",  # insight header line
        r"^CLINICAL FLAG\s*:\s*None\s*$",     # empty clinical flag
        r"^MEAL SUGGESTIONS\s*:\s*$",         # empty meal suggestions header
    ]

    # ── Strip prefix labels but keep the content after the colon ─────────────
    strip_prefix_patterns = [
        r"^#{1,6}\s*",                        # any markdown headers (####)
        r"^FINAL RECOMMENDATION\s*:\s*",
        r"^MEAL SUGGESTIONS\s*:\s*",
        r"^CLINICAL FLAG\s*:\s*",
        r"^RESPONSE\s*:\s*",
        r"^💡\s*\*\*Clinical Insight:\*\*\s*",
    ]

    lines = text.split("\n")
    cleaned = []

    for line in lines:
        stripped = line.strip()

        # skip pure metadata lines
        skip = False
        for pattern in remove_line_patterns:
            if re.match(pattern, stripped, re.IGNORECASE):
                skip = True
                break
        if skip:
            continue

        # strip prefix labels
        for pattern in strip_prefix_patterns:
            stripped = re.sub(pattern, "", stripped, flags=re.IGNORECASE)

        cleaned.append(stripped)

    result = "\n".join(cleaned).strip()
    result = re.sub(r"\n{3,}", "\n\n", result)  # collapse extra blank lines
    return result

# ── Main chat endpoint ────────────────────────────────────────────────────────
@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Request:  { "message": "...", "user_id": "PT-001", "stakeholder_type": "user" }
    Response: { "response": "...", "category": "...", "audit_flag": false }
    """
    try:
        data             = request.get_json(force=True)
        user_message     = data.get("message", "").strip()
        user_id          = data.get("user_id", "PT-001")

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        print(f"\n[→ Quick] user={user_id} | {user_message[:80]}")
        result = quick_response(user_message=user_message, user_id=user_id)

        category       = result.get("category", "")
        raw_response   = result.get("response", "")

        # only clean non-clinical responses — clinical must pass through as-is
        if category in ("nutrition", "exercise", "habits", "report_submission"):
            final_response = clean_response(raw_response)
        else:
            final_response = raw_response

        print(f"[← Quick] category={category} | audit={result.get('audit_flag', False)}")

        return jsonify({
            "response":   final_response,
            "category":   category,
            "audit_flag": result.get("audit_flag", False),
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "response": "An unexpected error occurred. Please try again.",
            "error": str(e),
        }), 500


# ── Upload Document Endpoint ──────────────────────────────────────────────────
@app.route("/api/upload", methods=["POST"])
def upload_document():
    """
    Accepts PDF or Image upload from frontend.
    Extracts text → DMH → Summary → saves to MemPalace.

    Request (multipart/form-data):
      - file: the uploaded file
      - user_id: patient identifier

    OR Request (JSON with base64):
      - file_data: base64 encoded file
      - filename: original filename
      - user_id: patient identifier

    Response:
      { "summary": "...", "dmh": "...", "filename": "...", "status": "success" }
    """
    try:
        user_id = None

        # ── Handle multipart file upload ──────────────────────────────────────
        if request.files.get("file"):
            file     = request.files["file"]
            user_id  = request.form.get("user_id", "default_user")
            filename = file.filename

            # validate
            allowed = {"pdf", "png", "jpg", "jpeg", "bmp", "tiff"}
            ext     = filename.lower().split(".")[-1]
            if ext not in allowed:
                return jsonify({"error": f"Unsupported file type: {ext}"}), 400

            import base64
            b64_data = base64.b64encode(file.read()).decode("utf-8")

        # ── Handle JSON base64 upload ─────────────────────────────────────────
        elif request.is_json:
            data     = request.get_json(force=True)
            b64_data = data.get("file_data", "")
            filename = data.get("filename", "document.pdf")
            user_id  = data.get("user_id", "default_user")
            if not b64_data:
                return jsonify({"error": "No file data provided"}), 400
        else:
            return jsonify({"error": "No file provided"}), 400

        print(f"\n[Upload] user={user_id} | file={filename}")

        # ── Process document ──────────────────────────────────────────────────
        result = process_document(
            b64_data = b64_data,
            filename = filename,
            user_id  = user_id,
            source   = "user_upload",
        )

        if result["status"] != "success":
            return jsonify(result), 400

        print(f"[Upload] Done — {result['char_extracted']} chars extracted")

        return jsonify({
            "status":   "success",
            "filename": filename,
            "summary":  result["summary"],
            "dmh":      result["dmh"],
            "saved":    result["saved_to_mempalace"],
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 60)
    print("  MAE|ME — AI Health Platform")
    print("  Flask server  →  http://localhost:5000")
    print("  Pipeline      →  Agents + Guardrails → vLLM (port 8000)")
    print("=" * 60)
    print()
    print("  ⚠️  SSH tunnel must be running:")
    print("  ssh -L 8000:localhost:8000 dgx-i-molsys@210.212.207.65 -N")
    print()
    app.run(host="0.0.0.0", port=5000, debug=True)
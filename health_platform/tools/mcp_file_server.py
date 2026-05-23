"""
MCP File Server — handles PDF and Image uploads.
Extracts text → sends to Qwen DMH Agent → Orinn Summary → saves to MemPalace.
"""
import os
import io
import base64
import fitz                          # PyMuPDF
from PIL import Image
import pytesseract
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
from config.settings import QWEN_API_KEY, QWEN_BASE_URL, get_orinn_llm
from demo.mempalace_bridge import save_interaction, save_clinical_note

TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ── Qwen DMH LLM ──────────────────────────────────────────────────────────────
_qwen_llm = ChatOpenAI(
    model="qwen2.5-14b",
    api_key=QWEN_API_KEY,
    base_url=QWEN_BASE_URL,
    temperature=0.1,
    max_tokens=None,
    extra_body={"max_tokens": 800},
)

DMH_PROMPT = """
You are a medical coder and assistant to a clinician.
Extract ALL facts from this medical document without missing anything.
Structure the output as:

DOCUMENT SUMMARY
================
SOURCE: {source}

KEY FINDINGS:
[List every test result, measurement, diagnosis, medication]

ABNORMAL VALUES:
[Only values outside normal range — mark clearly]

DIAGNOSES:
[All confirmed conditions]

MEDICATIONS:
[All medications with doses]

DOCTOR NOTES:
[Any clinical observations]

Do NOT skip any fact. Start directly with DOCUMENT SUMMARY.
"""

SHORT_SUMMARY_PROMPT = """
You are a senior clinical AI. Read this detailed medical record and write
a SHORT clinical summary in 5-6 bullet points for a clinician to read quickly.
Focus on: key diagnoses, critical abnormal values, current medications, urgent flags.
Start directly with bullet points. No preamble.
"""


# ── Extract text from PDF ─────────────────────────────────────────────────────
def extract_pdf(file_bytes: bytes) -> str:
    doc  = fitz.open(stream=file_bytes, filetype="pdf")
    text = []
    for i, page in enumerate(doc, 1):
        t = page.get_text("text").strip()
        if t:
            text.append(f"[PAGE {i}]\n{t}")
    doc.close()
    return "\n\n".join(text)


# ── Extract text from Image via OCR ──────────────────────────────────────────
def extract_image(file_bytes: bytes) -> str:
    img  = Image.open(io.BytesIO(file_bytes)).convert("L")  # grayscale
    text = pytesseract.image_to_string(img, lang="eng").strip()
    return text


# ── Extract from base64 (for frontend uploads) ───────────────────────────────
def extract_from_base64(b64_data: str, filename: str) -> dict:
    """
    Accepts base64 encoded file from frontend.
    Returns extracted text + metadata.
    """
    try:
        file_bytes = base64.b64decode(b64_data)
        ext        = filename.lower().split(".")[-1]

        if ext == "pdf":
            text      = extract_pdf(file_bytes)
            file_type = "pdf"
        elif ext in ("png", "jpg", "jpeg", "bmp", "tiff"):
            text      = extract_image(file_bytes)
            file_type = "image"
        else:
            return {"status": "error", "message": f"Unsupported format: {ext}"}

        return {
            "status":    "success",
            "file_type": file_type,
            "filename":  filename,
            "text":      text,
            "char_count": len(text),
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


# ── Create DMH from extracted text ───────────────────────────────────────────
def create_dmh(extracted_text: str, filename: str) -> str:
    """Qwen creates Detailed Medical History from raw text."""
    prompt = DMH_PROMPT.replace("{source}", filename)
    messages = [
        SystemMessage(content=prompt),
        HumanMessage(content=f"DOCUMENT TEXT:\n\n{extracted_text[:3000]}"),
    ]
    result = _qwen_llm.invoke(messages)
    return result.content.strip()


# ── Create short summary from DMH ────────────────────────────────────────────
def create_short_summary(dmh: str) -> str:
    """Orinn creates a short clinical summary from the full DMH."""
    orinn = get_orinn_llm(temperature=0.1)
    messages = [
        SystemMessage(content=SHORT_SUMMARY_PROMPT),
        HumanMessage(content=f"FULL MEDICAL RECORD:\n\n{dmh[:2000]}"),
    ]
    result = orinn.invoke(messages)
    return result.content.strip()


# ── Full pipeline: file → DMH → summary → MemPalace ─────────────────────────
def process_document(
    b64_data:  str,
    filename:  str,
    user_id:   str,
    source:    str = "upload",
) -> dict:
    """
    Complete document processing pipeline.
    1. Extract text from PDF/Image
    2. Qwen creates DMH
    3. Orinn creates short summary
    4. Save both to MemPalace
    Returns result dict for frontend.
    """
    # Step 1: extract
    extracted = extract_from_base64(b64_data, filename)
    if extracted["status"] != "success":
        return extracted

    raw_text = extracted["text"]
    if not raw_text.strip():
        return {"status": "error", "message": "No text could be extracted from this file."}

    # Step 2: DMH via Qwen
    dmh = create_dmh(raw_text, filename)

    # Step 3: short summary via Orinn
    short_summary = create_short_summary(dmh)

    # Step 4: save to MemPalace
    save_interaction(
        user_id    = user_id,
        user_msg   = f"[Document uploaded: {filename}]",
        assistant_msg = short_summary,
        category   = "report_submission",
    )
    save_clinical_note(
        patient_id = user_id,
        note       = f"Document: {filename}\n\nDMH:\n{dmh[:500]}",
        written_by = source,
    )

    return {
        "status":        "success",
        "filename":      filename,
        "char_extracted": len(raw_text),
        "dmh":           dmh,
        "summary":       short_summary,
        "saved_to_mempalace": True,
    }
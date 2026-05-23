"""
MCP Document Tools — Two core ingestion tools:
1. PDF to Text   — extracts text from uploaded medical PDFs
2. Image to Text — OCR extracts text from PNG/JPEG medical images

Both tools feed extracted text into the Qwen DMH pipeline.
"""
import os
import io
import fitz                         # PyMuPDF
from PIL import Image
import pytesseract
from langchain_core.tools import tool
from config.settings import DEBUG

# ── Tesseract path (Windows) ──────────────────────────────────────────────────
# Change this if your Tesseract is installed elsewhere
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH


# ── MCP Tool 1: PDF to Text ───────────────────────────────────────────────────
@tool
def pdf_to_text(file_path: str) -> dict:
    """
    Extracts all text from a PDF medical document.
    Handles multi-page PDFs, preserves page structure.
    Tags output with source filename for DMH referencing.

    Args:
        file_path: Full path to the PDF file

    Returns:
        dict with extracted text, page count, and source tag
    """
    if not os.path.exists(file_path):
        return {"status": "error", "message": f"File not found: {file_path}"}

    if not file_path.lower().endswith(".pdf"):
        return {"status": "error", "message": "File must be a PDF"}

    try:
        doc       = fitz.open(file_path)
        full_text = []
        for i, page in enumerate(doc, 1):
            text = page.get_text("text").strip()
            if text:
                full_text.append(f"[PAGE {i}]\n{text}")

        doc.close()
        extracted = "\n\n".join(full_text)
        source    = os.path.basename(file_path)

        if DEBUG:
            print(f"[MCPDocTools] PDF extracted: {source} | {len(doc)} pages | {len(extracted)} chars")

        return {
            "status":     "success",
            "source":     source,
            "source_type": "pdf",
            "page_count": len(full_text),
            "text":       extracted,
            "char_count": len(extracted),
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}


# ── MCP Tool 2: Image to Text (OCR) ──────────────────────────────────────────
@tool
def image_to_text(file_path: str) -> dict:
    """
    Extracts text from a medical image (PNG, JPEG, JPG) using OCR.
    Handles handwritten notes, printed lab reports, prescriptions.
    Tags output with source filename for DMH referencing.

    Args:
        file_path: Full path to the image file

    Returns:
        dict with extracted text and source tag
    """
    if not os.path.exists(file_path):
        return {"status": "error", "message": f"File not found: {file_path}"}

    allowed = (".png", ".jpg", ".jpeg", ".bmp", ".tiff")
    if not file_path.lower().endswith(allowed):
        return {"status": "error", "message": f"Unsupported format. Use: {allowed}"}

    try:
        img       = Image.open(file_path)
        # enhance image for better OCR accuracy
        img       = img.convert("L")          # grayscale
        extracted = pytesseract.image_to_string(img, lang="eng").strip()
        source    = os.path.basename(file_path)

        if DEBUG:
            print(f"[MCPDocTools] Image OCR: {source} | {len(extracted)} chars extracted")

        return {
            "status":      "success",
            "source":      source,
            "source_type": "image",
            "text":        extracted,
            "char_count":  len(extracted),
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}


# ── Combined: Auto-detect file type and extract ───────────────────────────────
@tool
def extract_document(file_path: str) -> dict:
    """
    Auto-detects file type and extracts text using the right tool.
    Use this as the single entry point for all document uploads.

    Args:
        file_path: Full path to PDF or image file

    Returns:
        Extracted text dict ready for DMH pipeline
    """
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return pdf_to_text.invoke({"file_path": file_path})
    elif ext in (".png", ".jpg", ".jpeg", ".bmp", ".tiff"):
        return image_to_text.invoke({"file_path": file_path})
    else:
        return {"status": "error", "message": f"Unsupported file type: {ext}"}


# ── Tool Registry ─────────────────────────────────────────────────────────────
DOCUMENT_TOOLS = [
    pdf_to_text,
    image_to_text,
    extract_document,
]
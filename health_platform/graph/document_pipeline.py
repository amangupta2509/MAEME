"""
Document Pipeline — End-to-end flow for medical document processing.

Flow:
  Upload PDF/Image
      → MCP Tool (extract text)
      → DMH Agent / Qwen (Detailed Medical History)
      → Orinn Summary Agent (short clinical summary)
      → MemPalace (store everything)
      → Arrangement Agent (format + push to DB)
      → Guardrail Auditor (safety check)
"""
from tools.mcp_document_tools import extract_document
from agents.experts.dmh_agent          import DMHAgent
from agents.experts.orinn_summary_agent import OrinnSummaryAgent
from agents.guardrails.auditor          import GuardrailAuditor
from agents.orchestration.arrangement_agent import ArrangementAgent
from rag.mempalace import mempalace, dump_to_mempalace
from graph.state   import get_initial_state
from config.settings import DEBUG


def process_medical_document(
    file_path:   str,
    patient_id:  str,
    uploaded_by: str = "clinician",
) -> dict:
    """
    Full pipeline to process a medical document.

    Args:
        file_path:   Path to PDF or image file
        patient_id:  Patient identifier
        uploaded_by: Stakeholder who uploaded (clinician/user/dietician)

    Returns:
        Result dict with DMH, clinical summary, and DB status
    """
    print(f"\n{'='*60}")
    print(f"DOCUMENT PIPELINE — {file_path}")
    print(f"{'='*60}")

    result = {
        "patient_id":    patient_id,
        "file":          file_path,
        "status":        "started",
        "extracted":     None,
        "dmh":           None,
        "clinical_summary": None,
        "db_pushed":     False,
        "audit":         None,
    }

    # ── STEP 1: Extract text ──────────────────────────────────────────────────
    print(f"\n[Step 1] Extracting text from document...")
    extracted = extract_document.invoke({"file_path": file_path})

    if extracted.get("status") != "success":
        result["status"] = "failed"
        result["error"]  = extracted.get("message", "Extraction failed")
        print(f"[Step 1] FAILED: {result['error']}")
        return result

    extracted_text = extracted["text"]
    source         = extracted["source"]
    print(f"[Step 1] Extracted {extracted['char_count']} chars from {source}")

    # ── STEP 2: Qwen creates DMH ──────────────────────────────────────────────
    print(f"\n[Step 2] Qwen creating Detailed Medical History...")
    dmh_agent = DMHAgent()
    dmh       = dmh_agent.create_dmh(extracted_text, source, patient_id)
    result["dmh"] = dmh
    print(f"[Step 2] DMH created: {len(dmh)} chars")

    # dump DMH to MemPalace
    mempalace.store(
        patient_id=patient_id,
        content=dmh,
        wing="dmh_agent",
        room="detailed_medical_history",
        source=source,
        metadata={"uploaded_by": uploaded_by},
    )
    print(f"[Step 2] DMH stored in MemPalace")

    # ── STEP 3: Orinn creates short clinical summary ──────────────────────────
    print(f"\n[Step 3] Orinn creating clinical summary...")
    summary_agent    = OrinnSummaryAgent()
    clinical_summary = summary_agent.summarise(dmh, patient_id)
    result["clinical_summary"] = clinical_summary
    print(f"[Step 3] Clinical summary created: {len(clinical_summary)} chars")

    # dump clinical summary to MemPalace
    mempalace.store(
        patient_id=patient_id,
        content=clinical_summary,
        wing="orinn_summary",
        room="clinical_summary",
        source=source,
        metadata={"uploaded_by": uploaded_by},
    )
    print(f"[Step 3] Clinical summary stored in MemPalace")

    # ── STEP 4: Arrangement Agent formats and pushes to DB ───────────────────
    print(f"\n[Step 4] Arrangement Agent formatting for DB...")
    arr_agent  = ArrangementAgent()
    db_data    = arr_agent.format_for_db(patient_id)
    db_success = arr_agent.push_to_db(patient_id, db_data)
    result["db_pushed"] = db_success
    print(f"[Step 4] DB push: {'SUCCESS' if db_success else 'FAILED'}")

    # ── STEP 5: Guardrail Auditor ─────────────────────────────────────────────
    print(f"\n[Step 5] Guardrail auditing...")
    state = get_initial_state(
        user_id=patient_id,
        stakeholder_type=uploaded_by,
        query=f"Document uploaded: {source}",
    )
    state["final_response"]   = clinical_summary
    state["query_category"]   = "report_submission"
    state["clinical_summary"] = clinical_summary

    auditor     = GuardrailAuditor()
    audit_state = auditor.run(state)
    result["audit"] = audit_state.get("audit_notes", "PASS")
    print(f"[Step 5] Audit: {result['audit'][:50]}")

    result["status"] = "completed"

    print(f"\n{'='*60}")
    print(f"PIPELINE COMPLETE")
    print(f"  DMH:      {len(dmh)} chars")
    print(f"  Summary:  {len(clinical_summary)} chars")
    print(f"  DB Push:  {db_success}")
    print(f"  Audit:    {result['audit'][:40]}")
    print(f"{'='*60}\n")

    return result
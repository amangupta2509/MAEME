"""
MCP Tools — Model Context Protocol tool kit for the health platform.
These tools are attached to expert agents via MCP for:
- Report parsing (image → medical text)
- DB push verification
- External health API calls
- Notification triggers
"""
from langchain_core.tools import tool
from config.settings import DEBUG


# ── Tool 1: Report Parser ─────────────────────────────────────────────────────
@tool
def parse_medical_report(report_text: str) -> dict:
    """
    Parse raw medical report text and extract structured data.
    Converts unstructured lab/clinical report into medical language.
    
    Args:
        report_text: Raw text from uploaded medical report or image OCR
    
    Returns:
        Structured dict with report type, findings, and flags
    """
    # In production: integrate with OCR + NLP pipeline
    # For now: returns structured placeholder ready for DB
    if DEBUG:
        print(f"[MCPTools] Parsing report: {report_text[:50]}...")

    return {
        "status":       "parsed",
        "report_type":  "lab_report",
        "raw_text":     report_text,
        "extracted":    True,
        "db_ready":     True,
    }


# ── Tool 2: DB Push ───────────────────────────────────────────────────────────
@tool
def push_to_database(user_id: str, data_type: str, content: dict) -> dict:
    """
    Push verified health data to the patient database.
    Only called after Report Manager marks db_push_ready=True.
    
    Args:
        user_id:   Patient identifier
        data_type: Type of data (clinical_summary / report / wellness_plan)
        content:   Verified data to store
    
    Returns:
        Push status dict
    """
    if DEBUG:
        print(f"[MCPTools] DB push for user={user_id} type={data_type}")

    # In production: connect to your actual DB (PostgreSQL, MongoDB, etc.)
    return {
        "status":    "success",
        "user_id":   user_id,
        "data_type": data_type,
        "stored":    True,
    }


# ── Tool 3: Clinician Notifier ────────────────────────────────────────────────
@tool
def notify_clinician(user_id: str, urgency: str, message: str) -> dict:
    """
    Send notification to the clinician for review or emergency escalation.
    
    Args:
        user_id:  Patient identifier
        urgency:  LOW / MEDIUM / HIGH / EMERGENCY
        message:  Notification message for the clinician
    
    Returns:
        Notification status
    """
    if DEBUG:
        print(f"[MCPTools] Notifying clinician: user={user_id} urgency={urgency}")

    # In production: integrate with email/SMS/push notification service
    return {
        "status":     "sent",
        "user_id":    user_id,
        "urgency":    urgency,
        "notified":   True,
    }


# ── Tool 4: RAG Attach ────────────────────────────────────────────────────────
@tool
def retrieve_health_knowledge(query: str, domain: str = "medical") -> str:
    """
    Retrieve relevant knowledge from the RAG knowledge base.
    
    Args:
        query:  The health query to retrieve context for
        domain: "medical" or "wellness"
    
    Returns:
        Relevant context string from knowledge base
    """
    if domain == "medical":
        from rag.medical_rag import retrieve_medical_context
        return retrieve_medical_context(query)
    else:
        from rag.wellness_rag import retrieve_wellness_context
        return retrieve_wellness_context(query)


# ── Tool Registry ─────────────────────────────────────────────────────────────
MCP_TOOLS = [
    parse_medical_report,
    push_to_database,
    notify_clinician,
    retrieve_health_knowledge,
]
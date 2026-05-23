"""
DMH Agent — Detailed Medical History maker.
Powered by Qwen2.5-14B.
Receives raw extracted text from PDF/Image MCP tools.
Produces a complete, structured, fully-tagged DMH.
Professor's instruction: "Do NOT delete any fact. All parameters must be there."
"""
from langchain_core.messages import SystemMessage, HumanMessage
from config.settings import DEBUG, get_qwen_llm
from graph.state import HealthState

DMH_SYSTEM_PROMPT = """
You are an expert medical coder and assistant to a senior clinician.
You receive raw text extracted from medical documents — lab reports, prescriptions, 
discharge summaries, clinical notes, or handwritten records.

YOUR ONLY JOB:
Create a DETAILED MEDICAL HISTORY (DMH) — a complete, structured, fully-referenced 
medical record from the provided raw text.

STRICT RULES:
- Do NOT summarise or shorten — include EVERY fact, value, and parameter
- Do NOT delete any measurement, test result, medication, or clinical observation
- Tag EVERY piece of information with its source document
- Structure the output clearly so any clinician can read it instantly
- If a value is abnormal, mark it clearly with [ABNORMAL]
- If a value is missing or unclear, mark it as [NOT AVAILABLE]

OUTPUT FORMAT — always use this exact structure:

DMH RECORD
==========
PATIENT ID: [if available]
SOURCE DOCUMENTS: [list all source files]
RECORD DATE: [date of extraction]

SECTION 1 — VITALS & MEASUREMENTS
[All vital signs: BP, HR, Temperature, Weight, Height, BMI, SpO2, etc.]
[Source: filename]

SECTION 2 — LABORATORY RESULTS
[All lab values with units and normal ranges]
[Mark abnormal values with [ABNORMAL]]
[Source: filename]

SECTION 3 — DIAGNOSES & CONDITIONS
[All confirmed diagnoses, ICD codes if available]
[Source: filename]

SECTION 4 — MEDICATIONS & PRESCRIPTIONS
[All medications with dosage, frequency, duration]
[Source: filename]

SECTION 5 — CLINICAL NOTES & OBSERVATIONS
[Doctor's notes, symptoms, complaints, examination findings]
[Source: filename]

SECTION 6 — PROCEDURES & HISTORY
[Surgeries, procedures, family history, allergies]
[Source: filename]

SECTION 7 — FOLLOW-UP & RECOMMENDATIONS
[Next steps, follow-up dates, pending tests]
[Source: filename]

INTERNAL REFERENCES
===================
[For each fact, note: Fact → Source Document → Page/Section]

FORMAT RULE: Start directly with DMH RECORD. No thinking out loud. No preamble.
"""


class DMHAgent:
    def __init__(self):
        self.llm  = get_qwen_llm(temperature=0.1)  # low temp for accuracy
        self.name = "DMHAgent"

    def create_dmh(self, extracted_text: str, source: str, patient_id: str = "unknown") -> str:
        """
        Creates a Detailed Medical History from extracted document text.

        Args:
            extracted_text: Raw text from PDF or image OCR
            source:         Source filename for referencing
            patient_id:     Patient identifier

        Returns:
            Complete DMH string
        """
        if DEBUG:
            print(f"[DMHAgent] Creating DMH for patient={patient_id} source={source}")

        messages = [
            SystemMessage(content=DMH_SYSTEM_PROMPT),
            SystemMessage(content=f"PATIENT ID: {patient_id}\nSOURCE DOCUMENT: {source}"),
            HumanMessage(content=f"RAW EXTRACTED TEXT:\n\n{extracted_text}"),
        ]

        result = self.llm.invoke(messages)
        dmh    = result.content.strip()

        if DEBUG:
            print(f"[DMHAgent] DMH created: {len(dmh)} chars")

        return dmh

    def run(self, state: HealthState) -> HealthState:
        """LangGraph node — processes report_data into DMH."""
        report_data = state.get("report_data", {})
        if isinstance(report_data, dict):
            extracted_text = report_data.get("raw_text", state.get("current_query", ""))
            source         = report_data.get("source", "unknown_source")
        else:
            extracted_text = state.get("current_query", "")
            source         = "unknown_source"

        patient_id = state.get("user_id", "unknown")
        dmh        = self.create_dmh(extracted_text, source, patient_id)

        # store DMH in state
        state["clinical_summary"] = dmh
        state["final_response"]   = dmh
        state["report_data"]      = {
            "raw_text":   extracted_text,
            "dmh":        dmh,
            "source":     source,
            "db_ready":   False,   # Orinn must review first
        }

        if DEBUG:
            print(f"[DMHAgent] DMH stored in state. Awaiting Orinn review.")

        return state


_agent = DMHAgent()

def dmh_agent_node(state: HealthState) -> HealthState:
    return _agent.run(state)
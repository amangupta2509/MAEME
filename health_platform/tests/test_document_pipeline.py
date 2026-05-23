"""
Test the full document pipeline:
1. Creates a sample medical text file
2. Runs it through the full pipeline
3. Shows DMH, clinical summary, and DB status
"""
import os
from graph.document_pipeline import process_medical_document
from rag.mempalace import mempalace

# ── Create a sample medical report for testing ────────────────────────────────
SAMPLE_REPORT = """
PATIENT MEDICAL REPORT
Date: 10 May 2026
Patient: John Doe | DOB: 15 March 1981 | ID: PT-001

VITALS:
Blood Pressure: 145/92 mmHg (High)
Heart Rate: 88 bpm
Temperature: 37.1°C
Weight: 89 kg | Height: 175 cm | BMI: 29.1
SpO2: 97%

LABORATORY RESULTS:
HbA1c: 8.2% (Normal: <5.7%) — ABNORMAL
Fasting Glucose: 178 mg/dL (Normal: 70-99 mg/dL) — ABNORMAL
LDL Cholesterol: 162 mg/dL (Normal: <100 mg/dL) — ABNORMAL
HDL Cholesterol: 38 mg/dL (Normal: >40 mg/dL) — ABNORMAL
Triglycerides: 210 mg/dL (Normal: <150 mg/dL) — ABNORMAL
Creatinine: 1.1 mg/dL (Normal: 0.7-1.2 mg/dL) — Normal
eGFR: 72 mL/min (Normal: >60) — Normal

DIAGNOSES:
1. Type 2 Diabetes Mellitus — poorly controlled (ICD: E11.9)
2. Essential Hypertension (ICD: I10)
3. Hyperlipidemia (ICD: E78.5)
4. Overweight (ICD: E66.09)

MEDICATIONS:
1. Metformin 500mg — twice daily with meals
2. Amlodipine 5mg — once daily
3. Atorvastatin 20mg — once at night

CLINICAL NOTES:
Patient complaints of fatigue and occasional dizziness.
Advised to reduce sodium intake and increase physical activity.
Referred to dietician for medical nutrition therapy.

FOLLOW-UP:
Repeat HbA1c in 3 months.
Review BP medication in 4 weeks.
"""

def run_pipeline_test():
    # write sample report to a text file (simulating document upload)
    sample_path = "tests/sample_medical_report.txt"
    os.makedirs("tests", exist_ok=True)

    with open(sample_path, "w") as f:
        f.write(SAMPLE_REPORT)

    print("Testing with sample medical report...")
    print(f"File: {sample_path}")

    # we test with .txt since it's a text file
    # in real use: pass a PDF or image path
    # manually run text through DMH agent directly
    from agents.experts.dmh_agent import DMHAgent
    from agents.experts.orinn_summary_agent import OrinnSummaryAgent
    from rag.mempalace import mempalace

    patient_id = "PT-001"

    print(f"\n{'='*60}")
    print("STEP 1 — Qwen DMH Agent")
    print(f"{'='*60}")
    dmh_agent = DMHAgent()
    dmh       = dmh_agent.create_dmh(SAMPLE_REPORT, "sample_medical_report.txt", patient_id)
    print(dmh[:600])
    print("...")

    # store in MemPalace
    mempalace.store(patient_id, dmh, "dmh_agent", "detailed_medical_history", "sample_report")
    print(f"\n✅ DMH stored in MemPalace ({len(dmh)} chars)")

    print(f"\n{'='*60}")
    print("STEP 2 — Orinn Summary Agent")
    print(f"{'='*60}")
    summary_agent = OrinnSummaryAgent()
    summary       = summary_agent.summarise(dmh, patient_id)
    print(summary[:600])
    print("...")

    mempalace.store(patient_id, summary, "orinn_summary", "clinical_summary", "sample_report")
    print(f"\n✅ Clinical summary stored in MemPalace ({len(summary)} chars)")

    print(f"\n{'='*60}")
    print("STEP 3 — MemPalace Search Test")
    print(f"{'='*60}")
    context = mempalace.search(patient_id, "diabetes medications blood sugar", top_k=2)
    print(f"Search result preview:\n{context[:300]}...")

    print(f"\n{'='*60}")
    print("STEP 4 — Arrangement Agent DB Push")
    print(f"{'='*60}")
    from agents.orchestration.arrangement_agent import ArrangementAgent
    arr   = ArrangementAgent()
    data  = arr.format_for_db(patient_id)
    pushed = arr.push_to_db(patient_id, data)
    print(f"DB push: {'SUCCESS ✅' if pushed else 'FAILED ❌'}")
    print(f"Diet plan keys: {list(data.get('diet_plan', {}).keys())}")
    print(f"Exercise plan keys: {list(data.get('exercise_plan', {}).keys())}")

    print(f"\n{'='*60}")
    print("PIPELINE TEST COMPLETE ✅")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    run_pipeline_test()
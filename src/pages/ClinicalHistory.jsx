import React, { useState } from "react";

export function ClinicalHistory() {
  const [selectedReport, setSelectedReport] = useState(null);

  const entries = [
    {
      date: "March 15, 2026",
      title: "Blood Test Report",
      summary:
        "CBC normal. Hemoglobin 13.8 g/dL. Blood sugar within normal fasting range. Cholesterol optimal at 178 mg/dL. No medications required.",
      details: {
        testName: "Complete Blood Count (CBC) & Metabolic Panel",
        labName: "HealthCare Diagnostics Center",
        labDate: "March 15, 2026",
        reportedBy: "Dr. Priya Sharma, MD",
        results: [
          {
            param: "Hemoglobin",
            value: "13.8",
            unit: "g/dL",
            range: "12.0-17.5",
            status: "Normal",
          },
          {
            param: "WBC Count",
            value: "7.2",
            unit: "K/uL",
            range: "4.5-11.0",
            status: "Normal",
          },
          {
            param: "Platelet Count",
            value: "245",
            unit: "K/uL",
            range: "150-400",
            status: "Normal",
          },
          {
            param: "Blood Sugar (Fasting)",
            value: "98",
            unit: "mg/dL",
            range: "70-100",
            status: "Normal",
          },
          {
            param: "Total Cholesterol",
            value: "178",
            unit: "mg/dL",
            range: "<200",
            status: "Normal",
          },
          {
            param: "HDL Cholesterol",
            value: "52",
            unit: "mg/dL",
            range: ">40",
            status: "Normal",
          },
          {
            param: "LDL Cholesterol",
            value: "105",
            unit: "mg/dL",
            range: "<130",
            status: "Normal",
          },
          {
            param: "Triglycerides",
            value: "120",
            unit: "mg/dL",
            range: "<150",
            status: "Normal",
          },
        ],
        recommendation:
          "All values are within normal range. Continue current lifestyle. Routine follow-up in 6 months.",
      },
    },
    {
      date: "January 8, 2026",
      title: "Full Body Checkup",
      summary:
        "BP excellent at 118/76. BMI healthy. Vitamin D deficiency noted (28 ng/mL). Supplement D3 2000 IU daily recommended. Follow up in 3 months.",
      details: {
        testName: "Full Body Preventive Health Checkup",
        labName: "Max Healthcare Institute",
        labDate: "January 8, 2026",
        reportedBy: "Dr. Rajesh Kumar, MD, DM (Cardiology)",
        results: [
          {
            param: "Blood Pressure",
            value: "118/76",
            unit: "mmHg",
            range: "<120/80",
            status: "Excellent",
          },
          {
            param: "Heart Rate",
            value: "72",
            unit: "bpm",
            range: "60-100",
            status: "Normal",
          },
          {
            param: "BMI",
            value: "22.4",
            unit: "kg/m²",
            range: "18.5-24.9",
            status: "Healthy",
          },
          {
            param: "Vitamin D",
            value: "28",
            unit: "ng/mL",
            range: "30-100",
            status: "Low",
          },
          {
            param: "Thyroid TSH",
            value: "2.1",
            unit: "mIU/L",
            range: "0.4-4.0",
            status: "Normal",
          },
          {
            param: "Liver Function",
            value: "Normal",
            unit: "",
            range: "",
            status: "Normal",
          },
          {
            param: "Kidney Function",
            value: "Normal",
            unit: "",
            range: "",
            status: "Normal",
          },
        ],
        recommendation:
          "Excellent overall health. Start Vitamin D3 2000 IU daily. Follow-up checkup in 3 months.",
      },
    },
    {
      date: "October 3, 2025",
      title: "Dental Checkup",
      summary:
        "No cavities. Minor plaque buildup. Advised professional cleaning every 6 months.",
      details: {
        testName: "Dental Health Assessment",
        labName: "Smile Dental Clinic",
        labDate: "October 3, 2025",
        reportedBy: "Dr. Amit Patel, BDS, MDS",
        results: [
          {
            param: "Cavity Status",
            value: "No cavities",
            unit: "",
            range: "",
            status: "Excellent",
          },
          {
            param: "Plaque Buildup",
            value: "Minor",
            unit: "",
            range: "",
            status: "Needs Attention",
          },
          {
            param: "Gum Health",
            value: "Good",
            unit: "",
            range: "",
            status: "Normal",
          },
          {
            param: "Tartar Deposits",
            value: "Minimal",
            unit: "",
            range: "",
            status: "Normal",
          },
          {
            param: "Tooth Alignment",
            value: "Good",
            unit: "",
            range: "",
            status: "Normal",
          },
          {
            param: "Enamel Quality",
            value: "Healthy",
            unit: "",
            range: "",
            status: "Normal",
          },
        ],
        recommendation:
          "Professional cleaning recommended every 6 months. Maintain regular brushing and flossing. Continue current oral hygiene routine.",
      },
    },
    {
      date: "July 20, 2025",
      title: "Eye Examination",
      summary:
        "Vision 6/6 both eyes. No correction required. No signs of strain or pressure issues.",
      details: {
        testName: "Comprehensive Eye Examination",
        labName: "Vision Plus Eye Care Center",
        labDate: "July 20, 2025",
        reportedBy: "Dr. Neha Verma, MBBS, MD (Ophthalmology)",
        results: [
          {
            param: "Right Eye Vision",
            value: "6/6",
            unit: "",
            range: "",
            status: "Perfect",
          },
          {
            param: "Left Eye Vision",
            value: "6/6",
            unit: "",
            range: "",
            status: "Perfect",
          },
          {
            param: "Color Vision Test",
            value: "Normal",
            unit: "",
            range: "",
            status: "Normal",
          },
          {
            param: "Intraocular Pressure (Right)",
            value: "14",
            unit: "mmHg",
            range: "<21",
            status: "Normal",
          },
          {
            param: "Intraocular Pressure (Left)",
            value: "15",
            unit: "mmHg",
            range: "<21",
            status: "Normal",
          },
          {
            param: "Retinal Health",
            value: "Healthy",
            unit: "",
            range: "",
            status: "Normal",
          },
          {
            param: "Lens Clarity",
            value: "Clear",
            unit: "",
            range: "",
            status: "Normal",
          },
        ],
        recommendation:
          "Excellent eye health. No correction needed. Routine eye checkup recommended every 2 years.",
      },
    },
  ];
  return (
    <>
      <h2
        className="page-heading-responsive"
        style={{
          fontFamily: "'Playfair Display',serif",
        }}
      >
        Clinical History
      </h2>
      <p className="greeting-sub" style={{ marginBottom: 24 }}>
        AI-generated timeline from your reports
      </p>
      <div className="card patient-card">
        <div className="patient-avatar">RK</div>
        <div className="patient-info">
          <div className="patient-name">Rahul Kumar</div>
          <div className="patient-meta">
            Age: 28 &nbsp;|&nbsp; Blood Group: O+
          </div>
          <div className="patient-chips">
            {[
              "Height 5'10\"",
              "Weight 72kg",
              "BMI 22.4",
              "Last checkup: Mar 2026",
            ].map((c, i) => (
              <span className="chip" key={i}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="timeline">
        {entries.map((e, i) => (
          <div className="tl-entry" key={i}>
            <div className="tl-dot" />
            <div className="tl-date">{e.date}</div>
            <div className="tl-title">{e.title}</div>
            <div className="tl-summary">{e.summary}</div>
            <button
              className="btn-outline"
              onClick={() => setSelectedReport(e)}
              style={{ marginTop: "12px" }}
            >
              View Report
            </button>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedReport(null)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "700px",
              width: "90%",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                borderBottom: "2px solid #f0f3f7",
                paddingBottom: "16px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "22px",
                    color: "#1a2332",
                    margin: 0,
                    marginBottom: "4px",
                  }}
                >
                  {selectedReport.title}
                </h3>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  {selectedReport.details.testName}
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "28px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ✕
              </button>
            </div>

            <div
              className="clinical-detail-grid"
              style={{
                fontSize: "14px",
              }}
            >
              <div>
                <div style={{ color: "#666", marginBottom: "4px" }}>
                  <strong>Laboratory:</strong>
                </div>
                <div>{selectedReport.details.labName}</div>
              </div>
              <div>
                <div style={{ color: "#666", marginBottom: "4px" }}>
                  <strong>Test Date:</strong>
                </div>
                <div>{selectedReport.details.labDate}</div>
              </div>
              <div>
                <div style={{ color: "#666", marginBottom: "4px" }}>
                  <strong>Reported By:</strong>
                </div>
                <div>{selectedReport.details.reportedBy}</div>
              </div>
              <div>
                <div style={{ color: "#666", marginBottom: "4px" }}>
                  <strong>Report Date:</strong>
                </div>
                <div>{selectedReport.date}</div>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1a2332",
                  marginBottom: "16px",
                  marginTop: 0,
                  borderBottom: "2px solid #f0f3f7",
                  paddingBottom: "12px",
                }}
              >
                Test Results
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "12px",
                }}
              >
                {selectedReport.details.results.map((result, idx) => (
                  <div
                    key={idx}
                    className="clinical-result-row"
                    style={{
                      borderLeft: `4px solid ${
                        result.status === "Normal" ||
                        result.status === "Excellent" ||
                        result.status === "Perfect"
                          ? "#00a8a8"
                          : result.status === "Healthy" ||
                              result.status === "Good"
                            ? "#28a745"
                            : "#ffc107"
                      }`,
                    }}
                  >
                    <div>
                      <strong>{result.param}</strong>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <strong>{result.value}</strong>
                      {result.unit && (
                        <span style={{ fontSize: "12px", color: "#666" }}>
                          {" "}
                          {result.unit}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        color: "#666",
                        fontSize: "12px",
                      }}
                    >
                      Range: {result.range}
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        padding: "4px 8px",
                        backgroundColor:
                          result.status === "Normal" ||
                          result.status === "Excellent" ||
                          result.status === "Perfect"
                            ? "#d4edda"
                            : result.status === "Healthy" ||
                                result.status === "Good"
                              ? "#d4edda"
                              : "#fff3cd",
                        color:
                          result.status === "Normal" ||
                          result.status === "Excellent" ||
                          result.status === "Perfect"
                            ? "#155724"
                            : result.status === "Healthy" ||
                                result.status === "Good"
                              ? "#155724"
                              : "#856404",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {result.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#e8f8f7",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "24px",
                borderLeft: "4px solid #00a8a8",
              }}
            >
              <div style={{ fontSize: "14px", color: "#004085" }}>
                <strong>Doctor's Recommendation:</strong>
                <div style={{ marginTop: "8px", lineHeight: "1.6" }}>
                  {selectedReport.details.recommendation}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedReport(null)}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#f5f7fa",
                border: "1px solid #e0e6ed",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                color: "#1a2332",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e0e6ed";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f5f7fa";
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

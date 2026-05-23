import React, { useState, useRef } from "react";
import { icons } from "../components/Icons";
import { GeneticReportModal } from "../components/GeneticReportModal";

export function Reports({ currentUser }) {
  const [showGeneticModal, setShowGeneticModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadedSummary, setUploadedSummary] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadMessage("⏳ Processing document...");
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", currentUser?.username || "default_user");
    
    const res  = await fetch("http://localhost:5000/api/upload", {
      method: "POST", body: formData
    });
    const data = await res.json();
    
    if (data.status === "success") {
      setUploadMessage(`✅ "${file.name}" analyzed successfully!`);
      setUploadedSummary(data.summary); // show summary below
    } else {
      setUploadMessage(`❌ Error: ${data.error}`);
    }
    
    // Reset the input value so the same file can be selected again
    event.target.value = "";
  };

  const reports = [
    {
      title: "Blood Test Report — March 2026",
      status: "Analyzed",
      date: "March 15, 2026",
      chips: [
        "Hemoglobin: 13.8 g/dL",
        "Blood Sugar: 98 mg/dL",
        "Cholesterol: 178 mg/dL",
      ],
      note: "Vijay parsed this report on Mar 16. All values within normal range.",
    },
    {
      title: "Full Body Checkup — Jan 2026",
      status: "Analyzed",
      date: "January 8, 2026",
      chips: ["BP: 118/76 mmHg", "BMI: 22.4", "Vitamin D: 28 ng/mL"],
      note: "Vijay flagged low Vitamin D. Supplement recommended.",
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
        Health Reports
      </h2>
      <p className="greeting-sub" style={{ marginBottom: 20 }}>
        Upload and analyze your medical documents
      </p>
      <div className="gr-cta">
        <div className="gr-cta-icon">{icons.dna}</div>
        <div className="gr-cta-info">
          <div className="gr-cta-title">Your Genetic Report</div>
          <div className="gr-cta-sub">
            Personalized nutrigenomics analysis based on your DNA
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowGeneticModal(true)}
        >
          View Full Report
        </button>
      </div>
      <div className="upload-zone">
        {icons.upload}
        <p>Drop your report here or click to upload</p>
        <small>Supports PDF, JPG, PNG — Max 10MB</small>
        <button className="btn-primary" onClick={handleBrowseClick}>
          Browse Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {uploadMessage && (
          <div
            style={{
              marginTop: "12px",
              padding: "12px",
              backgroundColor:
                uploadMessage.includes("✓") || uploadMessage.includes("✗")
                  ? uploadMessage.includes("✓")
                    ? "#d4edda"
                    : "#f8d7da"
                  : "#e7f3ff",
              borderRadius: "6px",
              fontSize: "14px",
              color: uploadMessage.includes("✓")
                ? "#155724"
                : uploadMessage.includes("✗")
                  ? "#721c24"
                  : "#004085",
              textAlign: "center",
            }}
          >
            {uploadMessage}
          </div>
        )}
        {uploadedSummary && (
          <div className="agent-note" style={{marginTop:"16px"}}>
            <strong>🤖 AI Summary:</strong><br/>
            {uploadedSummary}
          </div>
        )}
      </div>
      {reports.map((r, i) => (
        <div className="card report-card" key={i}>
          <div className="report-header">
            <span className="report-title">{r.title}</span>
            <span className="badge badge-green">{r.status}</span>
          </div>
          <div className="report-date">{r.date}</div>
          <div className="chips">
            {r.chips.map((c, j) => (
              <span className="chip" key={j}>
                {c}
              </span>
            ))}
          </div>
          <button className="btn-outline" onClick={() => setSelectedReport(r)}>
            View Details
          </button>
          <div className="agent-note">{r.note}</div>
        </div>
      ))}
      <h3
        className="page-subheading-responsive"
        style={{
          fontFamily: "'Playfair Display',serif",
        }}
      >
        How it works
      </h3>
      <div className="how-it-works">
        {[
          {
            n: "1",
            t: "Upload Report",
            d: "Upload your medical documents in any format",
          },
          {
            n: "2",
            t: "Agent Parses",
            d: "Vijay extracts key health metrics automatically",
          },
          {
            n: "3",
            t: "Data Saved",
            d: "Results are stored in your clinical history",
          },
        ].map((s, i) => (
          <div className="card step-card" key={i}>
            <div className="step-num">{s.n}</div>
            <div className="step-title">{s.t}</div>
            <div className="step-desc">{s.d}</div>
          </div>
        ))}
      </div>
      {showGeneticModal && (
        <GeneticReportModal onClose={() => setShowGeneticModal(false)} />
      )}

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
              maxWidth: "500px",
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
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "20px",
                  color: "#1a2332",
                  margin: 0,
                }}
              >
                {selectedReport.title}
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                backgroundColor: "#f5f7fa",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}
              >
                <strong>Date:</strong> {selectedReport.date}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {selectedReport.status}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1a2332",
                  marginBottom: "12px",
                }}
              >
                Key Metrics
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "12px",
                }}
              >
                {selectedReport.chips.map((chip, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#e8f8f7",
                      padding: "12px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#00a8a8",
                      fontWeight: "500",
                    }}
                  >
                    {chip}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#f0f7ff",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
                borderLeft: "4px solid #00a8a8",
              }}
            >
              <div style={{ fontSize: "14px", color: "#004085" }}>
                <strong>AI Insights:</strong> {selectedReport.note}
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

import React, { useState } from "react";
import {
  CheckCircle2,
  MessageSquare,
  Clipboard,
  AlertCircle,
} from "lucide-react";

export function NutritionistPlanReviews({ onPatientSelect }) {
  const [filter, setFilter] = useState("all");
  const [approvedPlans, setApprovedPlans] = useState(["priya"]);
  const [toastMessage, setToastMessage] = useState("");

  const planCards = [
    {
      id: "arjun-pending-1",
      patientId: "arjun",
      patient: "Arjun Sharma",
      status: "pending",
      chips: ["Vegetarian", "1800 kcal/day", "Diabetes Safe", "Low Sodium"],
      aiNote:
        "Plan generated based on HbA1c 8.2%, Hypertension Stage 1. Recommends: Palak Paneer, Dal Tadka, Oats. Avoids: Canned foods, High sodium, Simple sugars.",
      flag: false,
    },
    {
      id: "priya-pending-2",
      patientId: "priya",
      patient: "Priya Patel",
      status: "pending",
      chips: ["Non-Veg", "1600 kcal/day", "PCOS Protocol", "Low GI"],
      aiNote:
        "Plan optimized for PCOS management. High protein, low glycemic index foods prioritized. Exercise: Low impact recommended due to joint sensitivity.",
      flag: false,
    },
    {
      id: "wei-flagged-3",
      patientId: "wei",
      patient: "Wei Chen",
      status: "flagged",
      chips: ["Non-Veg", "2000 kcal/day", "HIGH RISK", "Review Required"],
      aiNote:
        "CLINICAL FLAG: HbA1c 9.1% — poorly controlled. Fasting glucose 210mg/dL requires immediate diet intervention. Recommend urgent clinician consultation before plan approval.",
      flag: true,
    },
    {
      id: "rahul-approved-4",
      patientId: "rahul",
      patient: "Rahul Kumar",
      status: approvedPlans.includes("rahul") ? "approved" : "pending",
      chips: [
        "Vegetarian",
        "1900 kcal/day",
        "Cholesterol Management",
        "High Fiber",
      ],
      aiNote:
        "Plan focuses on reducing LDL cholesterol through plant-based proteins and soluble fiber. Recommends: Oat bran, Beans, Lentils, Nuts. Monitor lipid levels every 3 months.",
      flag: false,
    },
  ];

  const filteredPlans = planCards.filter((plan) => {
    if (filter === "all") return true;
    if (filter === "pending")
      return (
        plan.status === "pending" && !approvedPlans.includes(plan.patientId)
      );
    if (filter === "approved") return approvedPlans.includes(plan.patientId);
    if (filter === "flagged") return plan.flag;
    return true;
  });

  const handleApprove = (patientId) => {
    setApprovedPlans((prev) => [...prev, patientId]);
    setToastMessage("Plan approved successfully!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleConsultAI = (patientId) => {
    const patient = planCards.find((p) => p.patientId === patientId);
    onPatientSelect({ id: patientId, name: patient?.patient });
  };

  const counts = {
    all: planCards.length,
    pending: planCards.filter(
      (p) =>
        (p.status === "pending" || p.status === "flagged") &&
        !approvedPlans.includes(p.patientId),
    ).length,
    approved: approvedPlans.length,
    flagged: planCards.filter((p) => p.flag).length,
  };

  return (
    <>
      <h1 className="greeting">Plan Reviews</h1>
      <p className="greeting-sub">AI-generated plans awaiting your approval</p>

      {/* Filter Tabs */}
      <div
        className="gr-tabs"
        style={{
          marginBottom: "24px",
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid #e0e8f0",
        }}
      >
        {["all", "pending", "approved", "flagged"].map((tab) => (
          <button
            key={tab}
            className={`gr-tab ${filter === tab ? "active" : ""}`}
            onClick={() => setFilter(tab)}
            style={{
              padding: "12px 16px",
              border: "none",
              background: "none",
              cursor: "pointer",
              borderBottom: filter === tab ? "2px solid #00a8a8" : "none",
              color: filter === tab ? "#00a8a8" : "#5a6b7d",
              fontWeight: filter === tab ? 600 : 400,
              textTransform: "capitalize",
            }}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Toast Message */}
      {toastMessage && (
        <div
          style={{
            background: "#d4f4e8",
            color: "#155724",
            padding: "12px 16px",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "14px",
            border: "1px solid #c3e6cb",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Plan Review Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="card" style={{ padding: "20px" }}>
            {/* Header with Status */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: 600 }}>
                {plan.patient}
              </div>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: 600,
                  background:
                    plan.flag || approvedPlans.includes(plan.patientId)
                      ? plan.flag
                        ? "#ffe0e0"
                        : "#d4f4e8"
                      : "#fff3cd",
                  color:
                    plan.flag || approvedPlans.includes(plan.patientId)
                      ? plan.flag
                        ? "#dc3545"
                        : "#155724"
                      : "#856404",
                  textTransform: "uppercase",
                }}
              >
                {plan.flag
                  ? "Flagged"
                  : approvedPlans.includes(plan.patientId)
                    ? "Approved"
                    : "Pending"}
              </span>
            </div>

            {/* Chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "12px",
              }}
            >
              {plan.chips.map((chip, i) => (
                <span
                  key={i}
                  className="chip"
                  style={{
                    background: "#f0f4f8",
                    color: "#5a6b7d",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* AI Note Box */}
            <div
              style={{
                background: plan.flag ? "#fff5f5" : "#f9f9f9",
                border: `1px solid ${plan.flag ? "#ffdddd" : "#e0e8f0"}`,
                borderRadius: "6px",
                padding: "12px",
                marginBottom: "16px",
                fontSize: "13px",
                lineHeight: "1.5",
                color: "#5a6b7d",
              }}
            >
              <strong>AI Recommendation:</strong>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                  margin: "6px 0 0 0",
                }}
              >
                {plan.flag && (
                  <AlertCircle
                    size={18}
                    style={{
                      marginTop: "2px",
                      flexShrink: 0,
                      color: "#ff9800",
                    }}
                  />
                )}
                <p style={{ margin: 0 }}>{plan.aiNote}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {!approvedPlans.includes(plan.patientId) && (
                <button
                  className="btn-primary"
                  onClick={() => handleApprove(plan.patientId)}
                  style={{
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <CheckCircle2 size={14} /> Approve Plan
                </button>
              )}
              <button
                className="btn-outline"
                style={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onClick={() => handleConsultAI(plan.patientId)}
              >
                <MessageSquare size={14} /> Consult AI
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#5a6b7d",
          }}
        >
          <Clipboard
            size={32}
            style={{ marginBottom: "12px", color: "#5a6b7d" }}
          />
          <p>No plans in this category</p>
        </div>
      )}
    </>
  );
}

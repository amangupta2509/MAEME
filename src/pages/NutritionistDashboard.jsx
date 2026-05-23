import React, { useState } from "react";
import { Users, Clock, CheckCircle, MessageSquare, Bot, X } from "lucide-react";

export function NutritionistDashboard({ onNavigateToAI }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const metrics = [
    { label: "Total Patients", value: "12", icon: Users },
    { label: "Plans Pending Review", value: "3", icon: Clock, badge: "red" },
    { label: "Plans Approved Today", value: "5", icon: CheckCircle },
    { label: "AI Consultations", value: "8", icon: MessageSquare },
  ];

  const recentActivity = [
    {
      patient: "Arjun Sharma",
      lastActive: "2 min ago",
      status: "Plan Pending",
      badge: "yellow",
    },
    {
      patient: "Priya Patel",
      lastActive: "1 hour ago",
      status: "Active",
      badge: "green",
    },
    {
      patient: "Rahul Kumar",
      lastActive: "3 hours ago",
      status: "Plan Approved",
      badge: "green",
    },
    {
      patient: "Wei Chen",
      lastActive: "Yesterday",
      status: "New Patient",
      badge: "blue",
    },
  ];

  const patientPlans = {
    "Arjun Sharma": {
      conditions: "Diabetes, Hypertension",
      calories: "2000-2200 kcal/day",
      protein: "25-30%",
      carbs: "45-50%",
      fats: "20-25%",
      recommendations: [
        "Reduce sodium intake to <5g/day",
        "Include high-fiber foods (25-30g/day)",
        "Limit refined sugars",
        "Increase whole grains",
        "Add lean proteins at each meal",
      ],
      mealExample:
        "Breakfast: Oats with berries, Lunch: Grilled chicken with brown rice, Dinner: Baked fish with vegetables",
    },
    "Priya Patel": {
      conditions: "PCOS, Obesity",
      calories: "1800-2000 kcal/day",
      protein: "30-35%",
      carbs: "40-45%",
      fats: "25-30%",
      recommendations: [
        "Low glycemic index foods preferred",
        "Increase protein intake for satiety",
        "Include omega-3 rich foods",
        "Limit dairy intake",
        "Regular meal timing",
      ],
      mealExample:
        "Breakfast: Eggs with vegetables, Lunch: Lentil salad with olive oil, Dinner: Tofu stir-fry with mixed vegetables",
    },
    "Rahul Kumar": {
      conditions: "High Cholesterol",
      calories: "2200-2400 kcal/day",
      protein: "20-25%",
      carbs: "50-55%",
      fats: "20-25% (low saturated)",
      recommendations: [
        "Reduce saturated fats",
        "Increase soluble fiber",
        "Include plant sterols",
        "Limit trans fats",
        "Add fatty fish twice weekly",
      ],
      mealExample:
        "Breakfast: Oatmeal with almonds, Lunch: Grilled salmon with vegetables, Dinner: Lentil curry with brown rice",
    },
    "Wei Chen": {
      conditions: "Diabetes, Hypertension",
      calories: "1900-2100 kcal/day",
      protein: "25-30%",
      carbs: "45-50%",
      fats: "20-25%",
      recommendations: [
        "Portion control important",
        "Include traditional whole grains",
        "Reduce sodium gradually",
        "Increase vegetable intake",
        "Monitor blood sugar response",
      ],
      mealExample:
        "Breakfast: Brown rice porridge with lean meat, Lunch: Steamed fish with vegetables, Dinner: Stir-fried tofu with broccoli",
    },
  };

  const aiInsight = {
    name: "Vijay — Your AI Assistant",
    message:
      "3 patients have pending plan reviews. Arjun Sharma's plan needs urgent attention — HbA1c elevated.",
  };

  return (
    <>
      <h1 className="greeting">Good morning, Dr. Nutritionist</h1>
      <p className="greeting-sub">Here's your patient overview for today</p>

      {/* Metrics Row */}
      <div className="metrics-row">
        {metrics.map((m, i) => {
          const IconComponent = m.icon;
          return (
            <div className="card metric-card" key={i}>
              <div style={{ marginBottom: "8px" }}>
                <IconComponent size={28} color="#00a8a8" />
              </div>
              <div className="metric-value">{m.value}</div>
              <div className="metric-label">{m.label}</div>
            </div>
          );
        })}
      </div>

      <div className="dash-columns">
        {/* Recent Activity Table */}
        <div className="card">
          <div className="card-title">Recent Patient Activity</div>
          <div className="card-subtitle">Latest updates from your patients</div>
          <div className="table-responsive-wrapper">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "16px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #e0e8f0" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 0",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#5a6b7d",
                    }}
                  >
                    Patient Name
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 0",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#5a6b7d",
                    }}
                  >
                    Last Active
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 0",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#5a6b7d",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "12px 0",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#5a6b7d",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f4f8" }}>
                    <td style={{ padding: "12px 0" }}>{item.patient}</td>
                    <td style={{ padding: "12px 0" }}>{item.lastActive}</td>
                    <td style={{ padding: "12px 0" }}>
                      <span
                        className={`badge badge-${item.badge === "green" ? "green" : "yellow"}`}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          background:
                            item.badge === "green"
                              ? "#d4f4e8"
                              : item.badge === "yellow"
                                ? "#fff3cd"
                                : "#d1ecf1",
                          color:
                            item.badge === "green"
                              ? "#155724"
                              : item.badge === "yellow"
                                ? "#856404"
                                : "#0c5460",
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 0", textAlign: "right" }}>
                      <button
                        className="btn-outline"
                        style={{ fontSize: "12px" }}
                        onClick={() => setSelectedPlan(item.patient)}
                      >
                        Review Plan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Card */}
        <div
          className="card"
          style={{ background: "#f0f8f8", borderLeft: "4px solid #00a8a8" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
              gap: "12px",
            }}
          >
            <Bot size={32} color="#00a8a8" />
            <div>
              <div className="card-title" style={{ margin: 0 }}>
                {aiInsight.name}
              </div>
            </div>
          </div>
          <p style={{ color: "#5a6b7d", margin: "12px 0", fontSize: "14px" }}>
            {aiInsight.message}
          </p>
          <button
            className="btn-primary"
            style={{ marginTop: "12px" }}
            onClick={onNavigateToAI}
          >
            Consult AI Agent
          </button>
        </div>
      </div>

      {/* Plan Review Modal */}
      {selectedPlan && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedPlan(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
              background: "white",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPlan(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
                zIndex: 10,
              }}
            >
              <X size={24} color="#5a6b7d" />
            </button>

            {/* Modal Header */}
            <div
              style={{
                paddingBottom: "16px",
                borderBottom: "1px solid #e0e8f0",
              }}
            >
              <h2 style={{ margin: 0, paddingRight: "40px", color: "#2d3748" }}>
                {selectedPlan} - Diet Plan Review
              </h2>
            </div>

            {/* Modal Content */}
            <div style={{ paddingTop: "20px" }}>
              {patientPlans[selectedPlan] && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <h3
                      style={{
                        color: "#00a8a8",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "8px",
                      }}
                    >
                      MEDICAL CONDITIONS
                    </h3>
                    <p
                      style={{ color: "#5a6b7d", fontSize: "14px", margin: 0 }}
                    >
                      {patientPlans[selectedPlan].conditions}
                    </p>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <h3
                      style={{
                        color: "#00a8a8",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "8px",
                      }}
                    >
                      CALORIE & MACRONUTRIENT TARGETS
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          background: "#f0f8f8",
                          padding: "12px",
                          borderRadius: "6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#5a6b7d",
                            marginBottom: "4px",
                          }}
                        >
                          Calories
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2d3748",
                          }}
                        >
                          {patientPlans[selectedPlan].calories}
                        </div>
                      </div>
                      <div
                        style={{
                          background: "#f0f8f8",
                          padding: "12px",
                          borderRadius: "6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#5a6b7d",
                            marginBottom: "4px",
                          }}
                        >
                          Protein
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2d3748",
                          }}
                        >
                          {patientPlans[selectedPlan].protein}
                        </div>
                      </div>
                      <div
                        style={{
                          background: "#f0f8f8",
                          padding: "12px",
                          borderRadius: "6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#5a6b7d",
                            marginBottom: "4px",
                          }}
                        >
                          Carbs
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2d3748",
                          }}
                        >
                          {patientPlans[selectedPlan].carbs}
                        </div>
                      </div>
                      <div
                        style={{
                          background: "#f0f8f8",
                          padding: "12px",
                          borderRadius: "6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#5a6b7d",
                            marginBottom: "4px",
                          }}
                        >
                          Fats
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2d3748",
                          }}
                        >
                          {patientPlans[selectedPlan].fats}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <h3
                      style={{
                        color: "#00a8a8",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "8px",
                      }}
                    >
                      KEY RECOMMENDATIONS
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {patientPlans[selectedPlan].recommendations.map(
                        (rec, i) => (
                          <li
                            key={i}
                            style={{
                              color: "#5a6b7d",
                              fontSize: "13px",
                              marginBottom: "6px",
                            }}
                          >
                            {rec}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <h3
                      style={{
                        color: "#00a8a8",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "8px",
                      }}
                    >
                      SAMPLE DAILY MEAL
                    </h3>
                    <p
                      style={{
                        color: "#5a6b7d",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        margin: 0,
                      }}
                    >
                      {patientPlans[selectedPlan].mealExample}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginTop: "24px",
                      borderTop: "1px solid #e0e8f0",
                      paddingTop: "16px",
                    }}
                  >
                    <button
                      className="btn-primary"
                      onClick={() => setSelectedPlan(null)}
                    >
                      Approve Plan
                    </button>
                    <button
                      className="btn-outline"
                      onClick={() => setSelectedPlan(null)}
                    >
                      Request Changes
                    </button>
                    <button
                      className="btn-outline"
                      onClick={() => setSelectedPlan(null)}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

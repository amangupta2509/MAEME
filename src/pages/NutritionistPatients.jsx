import React, { useState } from "react";
import {
  CheckCircle2,
  Edit,
  BarChart3,
  Utensils,
  AlertCircle,
  Pill,
  Sparkles,
  Calendar,
  Shield,
} from "lucide-react";

export function NutritionistPatients({ onSelectPatient }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlanPatient, setSelectedPlanPatient] = useState(null);
  const [approvedPlans, setApprovedPlans] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [modifyingPlan, setModifyingPlan] = useState(null);

  const patients = [
    {
      id: "arjun",
      name: "Arjun Sharma",
      age: 45,
      conditions: ["Type 2 Diabetes", "Hypertension"],
      foodPref: "Vegetarian",
      lastVisit: "Today",
      status: "Plan Pending",
      plan: {
        dailyCalories: "1800 kcal/day",
        meals: [
          {
            name: "Breakfast",
            items: "Oatmeal with almonds, Green tea",
            time: "7:00 AM",
          },
          {
            name: "Lunch",
            items: "Palak Paneer, Brown rice, Salad",
            time: "1:00 PM",
          },
          { name: "Snack", items: "Mixed berries, Yogurt", time: "4:00 PM" },
          {
            name: "Dinner",
            items: "Dal Tadka, Roti, Cucumber raita",
            time: "8:00 PM",
          },
        ],
        restrictions: ["No canned foods", "Low sodium", "Avoid simple sugars"],
        supplements: "Vitamin D: 1000 IU daily, Folic acid: 400 mcg daily",
        generatedDate: "May 18, 2026",
        aiNote: "Plan based on HbA1c 8.2%, optimized for blood sugar control",
      },
    },
    {
      id: "priya",
      name: "Priya Patel",
      age: 32,
      conditions: ["PCOS", "Obesity"],
      foodPref: "Non-Vegetarian",
      lastVisit: "Yesterday",
      status: "Active",
      plan: {
        dailyCalories: "1600 kcal/day",
        meals: [
          {
            name: "Breakfast",
            items: "Greek yogurt with berries, Honey",
            time: "7:30 AM",
          },
          {
            name: "Lunch",
            items: "Grilled chicken breast, Quinoa, Broccoli",
            time: "1:30 PM",
          },
          { name: "Snack", items: "Almonds, Apple", time: "4:30 PM" },
          {
            name: "Dinner",
            items: "Baked salmon, Sweet potato, Green beans",
            time: "8:30 PM",
          },
        ],
        restrictions: ["Low GI foods", "High protein", "Avoid refined carbs"],
        supplements: "Inositol: 2g twice daily, Vitamin B12: 1000 mcg weekly",
        generatedDate: "May 19, 2026",
        aiNote:
          "PCOS-optimized plan, high protein for satiety and hormonal balance",
      },
    },
    {
      id: "rahul",
      name: "Rahul Kumar",
      age: 28,
      conditions: ["High Cholesterol"],
      foodPref: "Both",
      lastVisit: "2 days ago",
      status: "Plan Approved",
      plan: {
        dailyCalories: "1900 kcal/day",
        meals: [
          {
            name: "Breakfast",
            items: "Oat bran cereal with skim milk",
            time: "7:00 AM",
          },
          {
            name: "Lunch",
            items: "Lentil soup, Whole wheat bread, Carrot sticks",
            time: "1:00 PM",
          },
          { name: "Snack", items: "Mixed nuts, Orange", time: "4:00 PM" },
          {
            name: "Dinner",
            items: "Grilled tilapia, Quinoa, Steamed broccoli",
            time: "8:00 PM",
          },
        ],
        restrictions: ["Low saturated fat", "High fiber", "Limit cholesterol"],
        supplements: "Omega-3: 1000mg daily, Plant sterols: 2g daily",
        generatedDate: "May 17, 2026",
        aiNote:
          "Cholesterol-reducing plan with emphasis on soluble fiber and lean proteins",
      },
    },
    {
      id: "wei",
      name: "Wei Chen",
      age: 48,
      conditions: ["Type 2 Diabetes", "Hypertension"],
      foodPref: "Non-Vegetarian",
      lastVisit: "1 week ago",
      status: "New",
      plan: {
        dailyCalories: "2000 kcal/day",
        meals: [
          {
            name: "Breakfast",
            items: "Scrambled egg whites, Whole wheat toast",
            time: "7:00 AM",
          },
          {
            name: "Lunch",
            items: "Stir-fried chicken with vegetables, Brown rice",
            time: "1:00 PM",
          },
          { name: "Snack", items: "Cucumber, Hummus", time: "4:00 PM" },
          {
            name: "Dinner",
            items: "Grilled lean beef, Sweet potato, Asparagus",
            time: "8:00 PM",
          },
        ],
        restrictions: [
          "No processed meats",
          "Low sodium",
          "Avoid refined grains",
        ],
        supplements: "Magnesium: 400mg daily, Chromium: 200mcg daily",
        generatedDate: "May 16, 2026",
        aiNote: "Dual-control plan for diabetes and hypertension management",
      },
    },
  ];

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.conditions.some((c) =>
        c.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const getBadgeColor = (status) => {
    switch (status) {
      case "Plan Pending":
        return { bg: "#fff3cd", color: "#856404" };
      case "Active":
        return { bg: "#d4f4e8", color: "#155724" };
      case "Plan Approved":
        return { bg: "#d1ecf1", color: "#0c5460" };
      case "New":
        return { bg: "#e7e9ff", color: "#4a3f9f" };
      default:
        return { bg: "#f0f4f8", color: "#5a6b7d" };
    }
  };

  return (
    <>
      <h1 className="greeting">My Patients</h1>
      <p className="greeting-sub">
        Manage your assigned patients and their health plans
      </p>

      {/* Search Bar */}
      <input
        className="chat-input"
        placeholder="Search patients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", marginBottom: "20px" }}
      />

      {/* Patient Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="card" style={{ padding: "20px" }}>
            {/* Header with Avatar and Info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                className="patient-avatar"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#00a8a8",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  className="patient-name"
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    marginBottom: "2px",
                  }}
                >
                  {patient.name}
                </div>
                <div
                  className="patient-meta"
                  style={{ fontSize: "12px", color: "#5a6b7d" }}
                >
                  Age: {patient.age}
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div style={{ marginBottom: "12px" }}>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: 500,
                  ...getBadgeColor(patient.status),
                }}
              >
                {patient.status}
              </span>
            </div>

            {/* Conditions Chips */}
            <div
              className="patient-chips"
              style={{
                marginBottom: "12px",
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
              }}
            >
              {patient.conditions.map((cond, i) => (
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
                  {cond}
                </span>
              ))}
              <span
                className="chip"
                style={{
                  background: "#f0f4f8",
                  color: "#5a6b7d",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "11px",
                }}
              >
                {patient.foodPref}
              </span>
            </div>

            {/* Meta Info */}
            <div
              style={{
                fontSize: "12px",
                color: "#5a6b7d",
                marginBottom: "16px",
              }}
            >
              Last visit: {patient.lastVisit}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="btn-primary"
                style={{ flex: 1, fontSize: "12px" }}
                onClick={() => setSelectedPlanPatient(patient)}
              >
                View Plan
              </button>
              <button
                className="btn-outline"
                style={{ flex: 1, fontSize: "12px" }}
                onClick={() =>
                  onSelectPatient({
                    id: patient.id,
                    name: patient.name,
                    ...patient,
                  })
                }
              >
                Chat with AI
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Modal */}
      {selectedPlanPatient && (
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
            padding: "20px",
          }}
          onClick={() => setSelectedPlanPatient(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "85vh",
              overflow: "auto",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "white",
                color: "white",
                padding: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  flex: 1,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    padding: 0,
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "#2d3748",
                  }}
                >
                  {selectedPlanPatient.name}'s Diet Plan
                </h2>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    padding: 0,
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#718096",
                  }}
                >
                  {selectedPlanPatient.conditions.join(", ")}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlanPatient(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2d3748",
                  fontSize: "28px",
                  cursor: "pointer",
                  padding: 0,
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "24px" }}>
              {/* Plan Meta Info */}
              <div style={{ marginBottom: "20px" }}>
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
                      borderLeft: "4px solid #00a8a8",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#5a6b7d",
                        marginBottom: "4px",
                      }}
                    >
                      Daily Calories
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#00a8a8",
                      }}
                    >
                      {selectedPlanPatient.plan.dailyCalories}
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#f0f8f8",
                      padding: "12px",
                      borderRadius: "6px",
                      borderLeft: "4px solid #00a8a8",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#5a6b7d",
                        marginBottom: "4px",
                      }}
                    >
                      Generated
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#2d3748",
                      }}
                    >
                      {selectedPlanPatient.plan.generatedDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Note */}
              <div
                style={{
                  background: "#e7f9f9",
                  border: "1px solid #d4e8e8",
                  borderLeft: "4px solid #00a8a8",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  marginBottom: "20px",
                  fontSize: "13px",
                  color: "#2d3748",
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <Sparkles
                  size={16}
                  style={{ marginTop: "2px", flexShrink: 0 }}
                  color="#00a8a8"
                />
                <div>
                  <strong>AI Insight:</strong> {selectedPlanPatient.plan.aiNote}
                </div>
              </div>

              {/* Meals Section */}
              <div style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    marginBottom: "12px",
                    color: "#2d3748",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Calendar size={18} color="#00a8a8" /> Daily Meal Schedule
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {selectedPlanPatient.plan.meals.map((meal, i) => (
                    <div
                      key={i}
                      style={{
                        border: "1px solid #e0e8f0",
                        borderRadius: "6px",
                        padding: "12px",
                        background: "#fafbfc",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "6px",
                        }}
                      >
                        <strong style={{ color: "#2d3748", fontSize: "14px" }}>
                          {meal.name}
                        </strong>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#00a8a8",
                            fontWeight: 600,
                          }}
                        >
                          {meal.time}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: "#5a6b7d",
                          lineHeight: "1.5",
                        }}
                      >
                        {meal.items}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restrictions */}
              <div style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    marginBottom: "12px",
                    color: "#2d3748",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <AlertCircle size={18} color="#dc3545" /> Food Restrictions
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedPlanPatient.plan.restrictions.map(
                    (restriction, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#ffe0e0",
                          color: "#dc3545",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {restriction}
                      </span>
                    ),
                  )}
                </div>
              </div>

              {/* Supplements */}
              <div style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    marginBottom: "12px",
                    color: "#2d3748",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Pill size={18} color="#1e3a5f" /> Supplements
                </h3>
                <div
                  style={{
                    background: "#e7f5ff",
                    border: "1px solid #b3d9ff",
                    borderRadius: "6px",
                    padding: "12px",
                    fontSize: "13px",
                    color: "#1e3a5f",
                    lineHeight: "1.6",
                  }}
                >
                  {selectedPlanPatient.plan.supplements}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button
                  className="btn-primary"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  onClick={() => {
                    setApprovedPlans([
                      ...approvedPlans,
                      selectedPlanPatient.id,
                    ]);
                    setToastMessage(
                      `${selectedPlanPatient.name}'s plan approved successfully!`,
                    );
                    setTimeout(() => setToastMessage(""), 3000);
                    setSelectedPlanPatient(null);
                  }}
                  disabled={approvedPlans.includes(selectedPlanPatient.id)}
                >
                  <CheckCircle2 size={18} />
                  {approvedPlans.includes(selectedPlanPatient.id)
                    ? "Already Approved"
                    : "Approve Plan"}
                </button>
                <button
                  className="btn-outline"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  onClick={() => {
                    setModifyingPlan(selectedPlanPatient.id);
                  }}
                >
                  <Edit size={18} />
                  Modify Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modify Plan Modal */}
      {modifyingPlan && selectedPlanPatient && (
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
            zIndex: 1001,
            padding: "20px",
          }}
          onClick={() => setModifyingPlan(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modify Modal Header */}
            <div
              style={{
                background: "white",
                color: "white",
                padding: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  flex: 1,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "26px",
                    fontWeight: 900,
                    color: "#2d3748",
                  }}
                >
                  Modify Plan
                </h2>
              </div>
              <button
                onClick={() => setModifyingPlan(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2d3748",
                  fontSize: "28px",
                  cursor: "pointer",
                  padding: 0,
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modify Content */}
            <div style={{ padding: "24px" }}>
              <p style={{ color: "#2d3748", marginBottom: "16px" }}>
                What would you like to modify for{" "}
                <strong>{selectedPlanPatient.name}</strong>'s plan?
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <button
                  style={{
                    padding: "12px 16px",
                    borderRadius: "6px",
                    border: "1px solid #e0e8f0",
                    background: "#fafbfc",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#2d3748",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#f0f4f8";
                    e.target.style.borderColor = "#00a8a8";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#fafbfc";
                    e.target.style.borderColor = "#e0e8f0";
                  }}
                  onClick={() => {
                    setToastMessage(
                      `Calories updated for ${selectedPlanPatient.name}'s plan`,
                    );
                    setTimeout(() => setToastMessage(""), 3000);
                    setModifyingPlan(null);
                  }}
                >
                  <BarChart3 size={16} /> Adjust Daily Calories
                </button>

                <button
                  style={{
                    padding: "12px 16px",
                    borderRadius: "6px",
                    border: "1px solid #e0e8f0",
                    background: "#fafbfc",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#2d3748",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#f0f4f8";
                    e.target.style.borderColor = "#00a8a8";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#fafbfc";
                    e.target.style.borderColor = "#e0e8f0";
                  }}
                  onClick={() => {
                    setToastMessage(
                      `Meal suggestions updated for ${selectedPlanPatient.name}`,
                    );
                    setTimeout(() => setToastMessage(""), 3000);
                    setModifyingPlan(null);
                  }}
                >
                  <Utensils size={16} /> Change Meal Options
                </button>

                <button
                  style={{
                    padding: "12px 16px",
                    borderRadius: "6px",
                    border: "1px solid #e0e8f0",
                    background: "#fafbfc",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#2d3748",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#f0f4f8";
                    e.target.style.borderColor = "#00a8a8";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#fafbfc";
                    e.target.style.borderColor = "#e0e8f0";
                  }}
                  onClick={() => {
                    setToastMessage(
                      `Food restrictions updated for ${selectedPlanPatient.name}`,
                    );
                    setTimeout(() => setToastMessage(""), 3000);
                    setModifyingPlan(null);
                  }}
                >
                  <AlertCircle size={16} /> Update Restrictions
                </button>

                <button
                  style={{
                    padding: "12px 16px",
                    borderRadius: "6px",
                    border: "1px solid #e0e8f0",
                    background: "#fafbfc",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#2d3748",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#f0f4f8";
                    e.target.style.borderColor = "#00a8a8";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#fafbfc";
                    e.target.style.borderColor = "#e0e8f0";
                  }}
                  onClick={() => {
                    setToastMessage(
                      `Supplements updated for ${selectedPlanPatient.name}`,
                    );
                    setTimeout(() => setToastMessage(""), 3000);
                    setModifyingPlan(null);
                  }}
                >
                  <Pill size={16} /> Modify Supplements
                </button>
              </div>

              <button
                className="btn-outline"
                style={{ width: "100%", marginTop: "16px" }}
                onClick={() => setModifyingPlan(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#d4f4e8",
            color: "#155724",
            padding: "16px 24px",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid #c3e6cb",
            zIndex: 2000,
            fontWeight: 500,
            fontSize: "14px",
            animation: "slideIn 0.3s ease",
          }}
        >
          {toastMessage}
        </div>
      )}
    </>
  );
}

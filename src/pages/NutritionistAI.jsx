import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  User,
  Clipboard,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { icons } from "../components/Icons";

export function NutritionistAI({ selectedPatient }) {
  const [selectedPatientId, setSelectedPatientId] = useState(
    selectedPatient?.id || null,
  );
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "agent",
      text: "Hello Dr. Nutritionist! I'm Vijay, your AI assistant. Select a patient above and I'll help you review their diet plan, identify nutritional gaps, and suggest evidence-based improvements.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const patients = [
    { id: "arjun", name: "Arjun Sharma", conditions: "Diabetes, Hypertension" },
    { id: "priya", name: "Priya Patel", conditions: "PCOS, Obesity" },
    { id: "rahul", name: "Rahul Kumar", conditions: "High Cholesterol" },
    { id: "wei", name: "Wei Chen", conditions: "Diabetes, Hypertension" },
  ];

  const quickPrompts = [
    "Review diet plan",
    "Check nutritional gaps",
    "Suggest meal changes",
    "Flag clinical concerns",
  ];

  useEffect(() => {
    if (selectedPatient?.id) {
      setSelectedPatientId(selectedPatient.id);
    }
  }, [selectedPatient]);

  const handleSendMessage = async (text = chatInput) => {
    if (!text.trim() || isLoading || !selectedPatientId) return;

    const userMsg = { type: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          user_id: selectedPatientId,
          stakeholder_type: "dietician",
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const agentText =
        data.response ||
        data.error ||
        "Sorry, I couldn't get a response. Please try again.";

      setMessages((prev) => [...prev, { type: "agent", text: agentText }]);
    } catch (err) {
      console.error("Chat API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "agent",
          text:
            "I'm having trouble connecting to the health agents right now. " +
            "Please make sure the server is running and try again.",
          hasIcon: "alert",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <>
      <h1 className="greeting">AI Nutritionist Consultation</h1>
      <p className="greeting-sub">
        Chat with Vijay to review and refine patient diet plans
      </p>

      <div className="ask-ai-content" style={{ maxWidth: "100%" }}>
        {/* Patient Selector */}
        <select
          className="chat-input"
          value={selectedPatientId || ""}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          style={{
            marginBottom: "12px",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #d4e8e8",
            fontSize: "14px",
          }}
        >
          <option value="">Select a patient...</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.conditions}
            </option>
          ))}
        </select>

        {/* System Context Box */}
        {selectedPatientId && (
          <div
            className="nutri-ai-context-bar"
            style={{
              background: "#f0f8f8",
              border: "1px solid #d4e8e8",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "16px",
              fontSize: "13px",
              color: "#5a6b7d",
            }}
          >
            <Stethoscope size={16} />
            Consulting as: Nutritionist &nbsp;|&nbsp;
            <User size={16} />
            Patient: {currentPatient?.name} &nbsp;|&nbsp;
            <Clipboard size={16} />
            Context: Diet & Nutrition Review
          </div>
        )}

        {/* Chat Messages */}
        <div className="chat-messages-large" style={{ marginBottom: "16px" }}>
          {messages.length === 0 ? (
            <div className="empty-chat">
              <MessageSquare
                size={48}
                color="#00a8a8"
                style={{ marginBottom: "12px" }}
              />
              <div className="empty-chat-text">
                Select a patient and start a conversation
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-msg ${msg.type}`}
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                {msg.hasIcon === "alert" && (
                  <AlertCircle
                    size={18}
                    style={{
                      marginTop: "2px",
                      flexShrink: 0,
                      color: "#ff9800",
                    }}
                  />
                )}
                <div>
                  {msg.text.split("\n").map((line, j) => (
                    <span key={j}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="chat-msg agent">
              <span className="typing-indicator">Vijay is thinking</span>
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        {selectedPatientId && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                className="btn-outline"
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                style={{ fontSize: "12px" }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input */}
        <div className="chat-input-bar-large">
          <input
            className="chat-input-large"
            placeholder={
              selectedPatientId
                ? "Ask about this patient's diet plan..."
                : "Select a patient first..."
            }
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading || !selectedPatientId}
          />
          <button
            className="chat-send-large"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !chatInput.trim() || !selectedPatientId}
          >
            {icons.send}
          </button>
        </div>
      </div>
    </>
  );
}

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { icons } from "../components/Icons";

export function AskAI({ onSendMessage, messages = [], isLoading = false }) {
  const [chatInput, setChatInput] = useState("");

  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setChatInput("");
  };

  return (
    <>
      <h2
        className="greeting"
        style={{
          fontFamily: "'Playfair Display',serif",
          textAlign: "center",
        }}
      >
        Hi I'm Vijay your AI Health Assistant
      </h2>
      <p
        className="greeting-sub"
        style={{ marginBottom: 24, textAlign: "center" }}
      >
        Your AI health assistant is ready to help with any health or fitness
        questions
      </p>

      <div className="ask-ai-content" style={{ maxWidth: "100%" }}>
        <div className="chat-messages-large">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">{icons.robot}</div>
              <div className="empty-chat-text">
                Start a conversation with Vijay
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

        <div className="chat-input-bar-large">
          <input
            className="chat-input-large"
            placeholder="Ask me about your health, fitness, nutrition, or wellness goals..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />
          <button
            className="chat-send-large"
            onClick={handleSendMessage}
            disabled={isLoading || !chatInput.trim()}
          >
            {icons.send}
          </button>
        </div>
      </div>
    </>
  );
}

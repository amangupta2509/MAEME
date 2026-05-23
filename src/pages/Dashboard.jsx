import React from "react";
import { icons } from "../components/Icons";

export function Dashboard({ onNavigateToAskAI }) {
  const metrics = [
    { label: "Steps Today", value: "8,240", target: "/ 10,000", pct: 82 },
    {
      label: "Calories Burned",
      value: "420",
      target: "kcal",
      pct: null,
      trend: "up",
    },
    {
      label: "Calories Consumed",
      value: "1,840",
      target: "kcal",
      pct: null,
      trend: "warn",
    },
    { label: "Water Intake", value: "1.8L", target: "/ 2.5L", pct: 72 },
  ];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const steps = [7200, 9800, 6500, 10200, 8800, 4500, 8240];
  const maxS = 12000,
    barW = 36,
    gap = 16,
    chartH = 160,
    leftPad = 40;
  const totalW = leftPad + days.length * (barW + gap);
  return (
    <>
      <h1 className="greeting">Good morning, Rahul</h1>
      <p className="greeting-sub">
        Here's your health summary for today — Apr 03, 2026
      </p>
      <div className="metrics-row">
        {metrics.map((m, i) => (
          <div className="card metric-card" key={i}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-target">
              {m.target}
              {m.trend === "up" && (
                <span className="trend-up" style={{ marginLeft: 8 }}>
                  {icons.arrowUp} +8%
                </span>
              )}
              {m.trend === "warn" && (
                <span className="trend-warn" style={{ marginLeft: 8 }}>
                  vs 2,000 goal
                </span>
              )}
            </div>
            {m.pct != null && (
              <div className="metric-bar-bg">
                <div
                  className="metric-bar-fill"
                  style={{ width: m.pct + "%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="dash-columns">
        <div className="card chart-card">
          <div className="card-title">Weekly Activity</div>
          <div className="card-subtitle">Steps per day this week</div>
          <svg
            viewBox={`0 0 ${totalW} ${chartH + 30}`}
            style={{ width: "100%", height: "auto" }}
          >
            {[0, 3000, 6000, 9000, 12000].map((v) => {
              const y = chartH - (v / maxS) * chartH;
              return (
                <g key={v}>
                  <line
                    x1={leftPad}
                    x2={totalW}
                    y1={y}
                    y2={y}
                    stroke="rgba(0, 168, 168, 0.1)"
                    strokeWidth="1"
                  />
                  <text
                    x={leftPad - 6}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="9"
                    fill="#5a6b7d"
                  >
                    {v > 0 ? v / 1000 + "k" : "0"}
                  </text>
                </g>
              );
            })}
            {days.map((d, i) => {
              const x = leftPad + i * (barW + gap) + gap / 2;
              const h = (steps[i] / maxS) * chartH;
              return (
                <g key={d}>
                  <rect
                    x={x}
                    y={chartH - h}
                    width={barW}
                    height={h}
                    rx={4}
                    fill={i === 6 ? "#00a8a8" : "#e8f5f5"}
                  />
                  <text
                    x={x + barW / 2}
                    y={chartH + 16}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#5a6b7d"
                  >
                    {d}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="card">
          <div className="card-title">Today's Plan</div>
          <div className="card-subtitle">Scheduled activities</div>
          {[
            { time: "08:00 AM", text: "Morning walk (30 min)", color: "green" },
            {
              time: "01:00 PM",
              text: "Lunch: Mediterranean bowl",
              color: "orange",
            },
            { time: "06:30 PM", text: "Strength training", color: "orange" },
          ].map((a, i) => (
            <div className="agenda-item" key={i}>
              <div className={`agenda-dot ${a.color}`} />
              <span className="agenda-time">{a.time}</span>
              <span className="agenda-text">{a.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card agent-card">
        <div className="agent-icon">{icons.robot}</div>
        <div>
          <div className="agent-name">Vijay — Your Health Agent</div>
          <div className="agent-text">
            Based on your activity this week, you're 12% above your step goal.
            Your calorie intake is balanced. I recommend increasing water intake
            by 0.7L today.
          </div>
          <button className="btn-primary" onClick={onNavigateToAskAI}>
            Ask Vijay
          </button>
        </div>
      </div>
    </>
  );
}

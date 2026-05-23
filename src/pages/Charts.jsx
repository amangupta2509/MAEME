import React, { useState } from "react";
import { icons } from "../components/Icons";
import { PlanModal } from "../components/PlanModal";

export function Charts() {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const diet = [
    { b: 380, l: 620, d: 550 },
    { b: 420, l: 580, d: 600 },
    { b: 350, l: 640, d: 520 },
    { b: 400, l: 610, d: 580 },
    { b: 360, l: 590, d: 540 },
    { b: 440, l: 650, d: 610 },
    { b: 390, l: 600, d: 560 },
  ];
  const maxCal = 2000,
    barW = 28,
    gap = 14,
    chartH = 150,
    leftPad = 36;
  const totalW = leftPad + days.length * (barW + gap) + 10;
  const exercise = [35, 0, 50, 40, 0, 60, 30],
    maxEx = 70,
    exStep = (totalW - leftPad - 20) / 6;
  const linePoints = exercise.map((v, i) => ({
    x: leftPad + i * exStep,
    y: chartH - (v / maxEx) * chartH,
  }));
  const linePath = linePoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");
  const areaPath =
    linePath + ` L${linePoints[6].x},${chartH} L${linePoints[0].x},${chartH} Z`;
  const macros = [
    { label: "Protein", value: "82g", target: "90g", pct: 91 },
    { label: "Carbs", value: "210g", target: "220g", pct: 95 },
    { label: "Fat", value: "58g", target: "65g", pct: 89 },
    { label: "Fiber", value: "24g", target: "30g", pct: 80 },
  ];
  return (
    <>
      <h2
        className="page-heading-responsive"
        style={{
          fontFamily: "'Playfair Display',serif",
        }}
      >
        Diet & Exercise Charts
      </h2>
      <p className="greeting-sub" style={{ marginBottom: 20 }}>
        Track your nutrition and activity patterns
      </p>
      <div className="gr-cta">
        <div className="gr-cta-icon">{icons.clipboard}</div>
        <div className="gr-cta-info">
          <div className="gr-cta-title">
            Your Personalized Diet & Exercise Plan
          </div>
          <div className="gr-cta-sub">
            AI-generated weekly plan tailored to your goals and genetic profile
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowPlanModal(true)}>
          View My Plan
        </button>
      </div>
      <div className="date-filter">
        <button className="date-btn">{icons.chevL}</button>
        <span>Apr 21 – 27</span>
        <button className="date-btn">{icons.chevR}</button>
      </div>
      <div className="charts-grid">
        <div className="card">
          <div className="card-title">Diet Chart</div>
          <div className="card-subtitle">
            Calorie intake breakdown — this week
          </div>
          <svg
            viewBox={`0 0 ${totalW} ${chartH + 30}`}
            style={{ width: "100%" }}
          >
            {[0, 500, 1000, 1500, 2000].map((v) => {
              const y = chartH - (v / maxCal) * chartH;
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
                    x={leftPad - 4}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="8"
                    fill="#5a6b7d"
                  >
                    {v}
                  </text>
                </g>
              );
            })}
            {days.map((d, i) => {
              const x = leftPad + i * (barW + gap) + gap / 2;
              const hB = (diet[i].b / maxCal) * chartH;
              const hL = (diet[i].l / maxCal) * chartH;
              const hD = (diet[i].d / maxCal) * chartH;
              return (
                <g key={d}>
                  <rect
                    x={x}
                    y={chartH - hD}
                    width={barW}
                    height={hD}
                    fill="#005555"
                  />
                  <rect
                    x={x}
                    y={chartH - hD - hL}
                    width={barW}
                    height={hL}
                    fill="#00a8a8"
                  />
                  <rect
                    x={x}
                    y={chartH - hD - hL - hB}
                    width={barW}
                    height={hB}
                    rx={4}
                    fill="#80d9d9"
                  />
                  <text
                    x={x + barW / 2}
                    y={chartH + 16}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#5a6b7d"
                  >
                    {d}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#80d9d9" }} />{" "}
              Breakfast
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#00a8a8" }} />{" "}
              Lunch
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#005555" }} />{" "}
              Dinner
            </span>
          </div>
          <div className="chart-total">Total weekly: 12,880 kcal</div>
        </div>
        <div className="card">
          <div className="card-title">Exercise Chart</div>
          <div className="card-subtitle">Activity minutes — this week</div>
          <svg
            viewBox={`0 0 ${totalW} ${chartH + 30}`}
            style={{ width: "100%" }}
          >
            {[0, 20, 40, 60].map((v) => {
              const y = chartH - (v / maxEx) * chartH;
              return (
                <g key={v}>
                  <line
                    x1={leftPad}
                    x2={totalW - 10}
                    y1={y}
                    y2={y}
                    stroke="rgba(0, 168, 168, 0.1)"
                    strokeWidth="1"
                  />
                  <text
                    x={leftPad - 4}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="8"
                    fill="#5a6b7d"
                  >
                    {v}
                  </text>
                </g>
              );
            })}
            <path d={areaPath} fill="rgba(0, 168, 168, 0.1)" />
            <path
              d={linePath}
              fill="none"
              stroke="#00a8a8"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {linePoints.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill="#00a8a8"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  x={p.x}
                  y={chartH + 16}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#5a6b7d"
                >
                  {days[i]}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Nutrition Summary</div>
        <div className="card-subtitle">Macro breakdown for today</div>
        <div className="macro-grid">
          {macros.map((m, i) => (
            <div className="card macro-pill" key={i}>
              <div className="macro-label">{m.label}</div>
              <div className="macro-value">{m.value}</div>
              <div className="macro-target">target {m.target}</div>
              <div className="metric-bar-bg">
                <div
                  className="metric-bar-fill"
                  style={{ width: m.pct + "%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {showPlanModal && <PlanModal onClose={() => setShowPlanModal(false)} />}
    </>
  );
}

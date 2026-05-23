import React, { useState } from "react";
import { Icon, icons } from "./Icons";

export function GeneticReportModal({ onClose }) {
  const [tab, setTab] = useState(0);
  const [openAcc, setOpenAcc] = useState({});
  const tabs = [
    "Overview",
    "Diet",
    "Nutrition",
    "Fitness",
    "Sleep",
    "Allergies",
    "Disease Risk",
    "Digestive",
  ];
  const toggleAcc = (k) => setOpenAcc((p) => ({ ...p, [k]: !p[k] }));
  const LvlBadge = ({ level }) => (
    <span className={`lvl lvl-${level.toLowerCase().replace(" ", "")}`}>
      {level}
    </span>
  );
  const ScoreBar = ({ score }) => {
    const cls = score <= 4 ? "low" : score <= 6 ? "moderate" : "high";
    return (
      <div className="gr-score-bar">
        <div
          className={`gr-score-fill ${cls}`}
          style={{ width: (score / 10) * 100 + "%" }}
        />
      </div>
    );
  };
  return (
    <div className="gr-overlay" onClick={onClose}>
      <div className="gr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gr-header">
          <div className="gr-header-icon">{icons.dna}</div>
          <div className="gr-header-info">
            <div className="gr-header-title">Genetic Health Report</div>
            <div className="gr-header-sub">Rahul Kumar &middot; DNL1000001</div>
          </div>
          <button className="gr-close" onClick={onClose}>
            {icons.close}
          </button>
        </div>
        <div className="gr-tabs">
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`gr-tab${tab === i ? " active" : ""}`}
              onClick={() => setTab(i)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="gr-body">
          {tab === 0 && (
            <>
              <div className="gr-strip">
                <div className="gr-strip-chip">Blood Group: O+</div>
                <div className="gr-strip-chip">Age: 28</div>
                <div className="gr-strip-chip">DNA Sample: Valid</div>
                <div className="gr-strip-chip">Report: Apr 2026</div>
              </div>
              <div className="gr-info">
                <strong>What is Nutrigenomics?</strong>
                <br />
                Nutrigenomics studies how your genes interact with the nutrients
                you consume. By analyzing specific genetic markers, we can
                provide personalized dietary and lifestyle recommendations
                tailored to your unique DNA profile.
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                Key Highlights
              </div>
              <div className="gr-2col">
                {[
                  { title: "Low Lactose Sensitivity", level: "Low" },
                  { title: "Vitamin D — Restricted Intake", level: "High" },
                  { title: "High Endurance Potential", level: "Advantage" },
                  { title: "Moderate Caffeine Sensitivity", level: "Moderate" },
                ].map((h, i) => (
                  <div className="gr-card" key={i}>
                    <div className="gr-card-title">
                      {h.title} <LvlBadge level={h.level} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {tab === 1 && (
            <div className="gr-2col">
              {[
                {
                  title: "Lactose Sensitivity",
                  score: 3,
                  level: "Low",
                  rec: "Moderate dairy okay. Choose low-fat options.",
                },
                {
                  title: "Gluten Sensitivity",
                  score: 4,
                  level: "Low",
                  rec: "No intolerance. Whole grains beneficial.",
                },
                {
                  title: "Caffeine Metabolism",
                  score: 6,
                  level: "Moderate",
                  rec: "Max 2 cups/day. Avoid after 3 PM.",
                },
                {
                  title: "Carbohydrate Metabolism",
                  score: 7,
                  level: "High",
                  rec: "Prefer complex carbs. Avoid refined sugars.",
                },
                {
                  title: "Fat Absorption",
                  score: 5,
                  level: "Normal",
                  rec: "Include Omega-3 rich foods.",
                },
                {
                  title: "Alcohol Sensitivity",
                  score: 8,
                  level: "High",
                  rec: "Strictly limit alcohol intake.",
                },
              ].map((it, i) => (
                <div className="gr-card" key={i}>
                  <div className="gr-card-title">
                    {it.title} <LvlBadge level={it.level} />
                  </div>
                  <div style={{ fontSize: 12, color: "#a08070" }}>
                    Score {it.score}/10
                  </div>
                  <ScoreBar score={it.score} />
                  <div className="gr-card-rec">{it.rec}</div>
                </div>
              ))}
            </div>
          )}
          {tab === 2 && (
            <>
              {[
                {
                  label: "Vitamins",
                  items: [
                    {
                      name: "Vitamin D",
                      level: "Restricted",
                      impact: "Bone health, immunity",
                      source: "Sunlight, fish",
                    },
                    {
                      name: "Vitamin B12",
                      level: "Normal",
                      impact: "Energy, nerve function",
                      source: "Eggs, dairy",
                    },
                    {
                      name: "Vitamin C",
                      level: "Enhanced",
                      impact: "Antioxidant, skin health",
                      source: "Citrus, peppers",
                    },
                  ],
                },
                {
                  label: "Minerals",
                  items: [
                    {
                      name: "Iron",
                      level: "Normal",
                      impact: "Oxygen transport, energy",
                      source: "Spinach, lentils",
                    },
                    {
                      name: "Calcium",
                      level: "Enhanced",
                      impact: "Bone density, muscles",
                      source: "Dairy, greens",
                    },
                    {
                      name: "Magnesium",
                      level: "Restricted",
                      impact: "Sleep, muscle relaxation",
                      source: "Nuts, seeds",
                    },
                  ],
                },
                {
                  label: "Fats",
                  items: [
                    {
                      name: "Omega-3",
                      level: "Restricted",
                      impact: "Heart and brain health",
                      source: "Salmon, walnuts",
                    },
                    {
                      name: "Omega-6",
                      level: "Enhanced",
                      impact: "Inflammation balance",
                      source: "Sunflower, soy",
                    },
                  ],
                },
              ].map((g, gi) => (
                <div key={gi}>
                  <div className="gr-section-label">{g.label}</div>
                  {g.items.map((it, ii) => (
                    <div className="gr-nutr-row" key={ii}>
                      <div className="gr-nutr-name">{it.name}</div>
                      <LvlBadge level={it.level} />
                      <div className="gr-nutr-impact">{it.impact}</div>
                      <div className="gr-nutr-source">{it.source}</div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
          {tab === 3 && (
            <div className="gr-2col">
              {[
                {
                  title: "Recovery Ability",
                  level: "High",
                  rec: "Fast muscle recovery. Train consecutive days.",
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                },
                {
                  title: "Optimal Exercise Time",
                  level: "Morning",
                  rec: "Peak cortisol. High intensity works best.",
                  icon: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
                },
                {
                  title: "Exercise Type",
                  level: "Mixed",
                  rec: "Balanced fast/slow-twitch fibers.",
                  icon: "M18 20V10M12 20V4M6 20v-6",
                },
                {
                  title: "Injury Risk",
                  level: "Low",
                  rec: "Low predisposition to soft tissue injuries.",
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                },
                {
                  title: "Endurance Capacity",
                  level: "High",
                  rec: "Strong VO2 max. Running and cycling ideal.",
                  icon: "M22 12h-4l-3 9L9 3l-3 9H2",
                },
              ].map((it, i) => (
                <div
                  className="gr-card"
                  key={i}
                  style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "#fef6ef",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon d={it.icon} size={18} stroke="#cc5500" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="gr-card-title">
                      {it.title} <LvlBadge level={it.level} />
                    </div>
                    <div className="gr-card-rec">{it.rec}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 4 && (
            <>
              {[
                {
                  title: "Sleep Cycle",
                  text: "Maintain consistent sleep/wake times. No blue light 1hr before bed.",
                },
                {
                  title: "Deep Sleep Quality",
                  text: "Lighter deep sleep phases. Magnesium supplement may help.",
                },
                {
                  title: "Circadian Rhythm",
                  text: "10 min morning light exposure resets your natural clock.",
                },
              ].map((it, i) => (
                <div className="gr-sleep-card" key={i}>
                  <div className="gr-sleep-title">
                    {icons.moon} {it.title}
                  </div>
                  <div className="gr-sleep-text">{it.text}</div>
                </div>
              ))}
            </>
          )}
          {tab === 5 && (
            <>
              {[
                { level: "High", border: "#c0392b", items: ["Dust", "Pollen"] },
                {
                  level: "Moderate",
                  border: "#b85c00",
                  items: ["Pet Dander", "Mold", "Nickel"],
                },
                {
                  level: "Low",
                  border: "#2d7a4f",
                  items: ["Gluten", "Shellfish", "Latex"],
                },
              ].map((g, gi) => (
                <div key={gi} style={{ marginBottom: 20 }}>
                  <div className="gr-section-label">{g.level} Risk</div>
                  <div className="gr-4col">
                    {g.items.map((name, ii) => (
                      <div
                        className="gr-allergy"
                        key={ii}
                        style={{ borderTop: `3px solid ${g.border}` }}
                      >
                        <div className="gr-allergy-name">{name}</div>
                        <LvlBadge level={g.level} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
          {tab === 6 && (
            <>
              {[
                {
                  id: "heart",
                  title: "Heart",
                  level: "Moderate",
                  items: [
                    { label: "Avoid", text: "Saturated fats, excess sodium" },
                    { label: "Follow", text: "30 min cardio 5x/week" },
                    { label: "Consume", text: "Omega-3, leafy greens" },
                    { label: "Monitor", text: "Blood pressure monthly" },
                  ],
                },
                {
                  id: "diabetes",
                  title: "Diabetes",
                  level: "Low",
                  items: [
                    { label: "Avoid", text: "Refined sugar, sugary drinks" },
                    { label: "Follow", text: "Consistent meal timing" },
                    { label: "Consume", text: "High-fiber foods, cinnamon" },
                    { label: "Monitor", text: "Fasting sugar annually" },
                  ],
                },
                {
                  id: "bone",
                  title: "Bone",
                  level: "Low",
                  items: [
                    { label: "Avoid", text: "Excess caffeine, soda" },
                    { label: "Follow", text: "Weight-bearing exercise" },
                    { label: "Consume", text: "Calcium, Vitamin D, K2" },
                    { label: "Monitor", text: "Bone density every 2 years" },
                  ],
                },
                {
                  id: "liver",
                  title: "Liver",
                  level: "Low",
                  items: [
                    { label: "Avoid", text: "Alcohol, processed oils" },
                    { label: "Follow", text: "Adequate hydration daily" },
                    { label: "Consume", text: "Turmeric, garlic" },
                    { label: "Monitor", text: "Liver enzymes annually" },
                  ],
                },
              ].map((d) => (
                <div className="gr-acc" key={d.id}>
                  <div
                    className="gr-acc-header"
                    onClick={() => toggleAcc(d.id)}
                  >
                    <div className="gr-acc-title">
                      {d.title} <LvlBadge level={d.level} />
                    </div>
                    <span
                      className={`gr-acc-chevron${
                        openAcc[d.id] ? " open" : ""
                      }`}
                    >
                      {icons.chevDown}
                    </span>
                  </div>
                  {openAcc[d.id] && (
                    <div className="gr-acc-body">
                      {d.items.map((it, i) => (
                        <div className="gr-acc-item" key={i}>
                          <span className="gr-acc-item-label">{it.label}</span>{" "}
                          {it.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          {tab === 7 && (
            <div className="gr-2col">
              {[
                {
                  title: "Lactose Intolerance",
                  level: "Low",
                  rec: "Can tolerate moderate dairy. Try Greek yogurt.",
                },
                {
                  title: "IBS Tendency",
                  level: "Moderate",
                  rec: "Avoid raw onions. Low-FODMAP on flare days.",
                },
                {
                  title: "Gut Microbiome",
                  level: "High",
                  rec: "Include kefir, kimchi, yogurt daily.",
                },
                {
                  title: "Bloating",
                  level: "Moderate",
                  rec: "Eat slowly. Avoid carbonated drinks.",
                },
              ].map((it, i) => (
                <div className="gr-card" key={i}>
                  <div className="gr-card-title">
                    {it.title} <LvlBadge level={it.level} />
                  </div>
                  <div className="gr-card-rec">{it.rec}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

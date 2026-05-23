import React, { useState } from "react";
import { icons } from "./Icons";
import { DietPlanTab, ExercisePlanTab } from "./PlanTabs";

export function PlanModal({ onClose }) {
  const [tab, setTab] = useState(0);
  return (
    <div className="gr-overlay" onClick={onClose}>
      <div className="gr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gr-header">
          <div className="gr-header-icon">{icons.clipboard}</div>
          <div className="gr-header-info">
            <div className="gr-header-title">Diet & Exercise Plan</div>
            <div className="gr-header-sub">
              Rahul Kumar &middot; Week Apr 28, 2026
            </div>
          </div>
          <button className="gr-close" onClick={onClose}>
            {icons.close}
          </button>
        </div>
        <div className="gr-tabs">
          {["Diet Plan", "Exercise Plan"].map((t, i) => (
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
          {tab === 0 ? <DietPlanTab /> : <ExercisePlanTab />}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  BarChart3,
  Users,
  MessageSquare,
  Clipboard,
  Bell,
  LogOut,
  Menu,
} from "lucide-react";
import { NutritionistDashboard } from "./NutritionistDashboard";
import { NutritionistPatients } from "./NutritionistPatients";
import { NutritionistAI } from "./NutritionistAI";
import { NutritionistPlanReviews } from "./NutritionistPlanReviews";

export function NutritionistApp({ currentUser, onLogout }) {
  const [currentPage, setCurrentPage] = useState("nutri-dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    {
      text: "Arjun Sharma's plan needs urgent review - HbA1c elevated",
      time: "5 min ago",
    },
    { text: "New patient Wei Chen added to your caseload", time: "1 hour ago" },
    {
      text: "Vijay has generated diet plan recommendations for Priya Patel",
      time: "3 hours ago",
    },
  ];

  const navItems = [
    { id: "nutri-dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "patients", label: "My Patients", icon: Users },
    { id: "nutri-ai", label: "Ask AI Agent", icon: MessageSquare },
    { id: "plan-reviews", label: "Plan Reviews", icon: Clipboard },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "nutri-dashboard":
        return (
          <NutritionistDashboard
            onNavigateToAI={() => setCurrentPage("nutri-ai")}
          />
        );
      case "patients":
        return (
          <NutritionistPatients
            onSelectPatient={(patient) => {
              setSelectedPatient(patient);
              setCurrentPage("nutri-ai");
            }}
          />
        );
      case "nutri-ai":
        return <NutritionistAI selectedPatient={selectedPatient} />;
      case "plan-reviews":
        return (
          <NutritionistPlanReviews
            onPatientSelect={(patient) => {
              setSelectedPatient(patient);
              setCurrentPage("nutri-ai");
            }}
          />
        );
      default:
        return (
          <NutritionistDashboard
            onNavigateToAI={() => setCurrentPage("nutri-ai")}
          />
        );
    }
  };

  return (
    <div
      className={`app-layout${mobileSidebarOpen ? " sidebar-open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setMobileSidebarOpen(false);
        }
      }}
    >
      {/* Sidebar */}
      <aside className={`sidebar${mobileSidebarOpen ? " mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <img src="/logo.png" alt="MAEME Logo" className="sidebar-logo-img" />
        </div>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: "#00a8a8" }}>
            {currentUser?.username?.[0]?.toUpperCase() || "D"}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Dr. Nutritionist</div>
            <div className="sidebar-user-plan">Nutritionist Account</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((n) => {
            const IconComponent = n.icon;
            return (
              <div
                key={n.id}
                className={`nav-item ${currentPage === n.id ? "active" : ""}`}
                onClick={() => {
                  setCurrentPage(n.id);
                  setMobileSidebarOpen(false);
                }}
                style={{ cursor: "pointer" }}
              >
                <IconComponent size={18} style={{ marginRight: "8px" }} />
                {n.label}
              </div>
            );
          })}
        </nav>
        <div
          className="nav-item"
          onClick={onLogout}
          style={{
            cursor: "pointer",
            marginTop: "auto",
            color: "#dc3545",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <LogOut size={18} />
          Logout
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <button
            className="topbar-menu-toggle"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Menu size={24} />
          </button>
          <div className="topbar-title">Nutritionist Dashboard</div>
          <div className="topbar-right">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ position: "relative" }}>
                <Bell
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setMobileSidebarOpen(false);
                  }}
                />
                {notifications.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      background: "#dc3545",
                      color: "white",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {notifications.length}
                  </span>
                )}
              </div>
              <button
                onClick={onLogout}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#2d3748",
                  fontSize: "14px",
                  padding: "4px 8px",
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="page">{renderPage()}</div>
      </div>

      {/* Notifications Popup */}
      {notifOpen && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            right: "12px",
            background: "white",
            border: "1px solid #e0e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            width: "320px",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1001,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Notification Header */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #e0e8f0",
              fontWeight: 600,
              fontSize: "14px",
              color: "#2d3748",
            }}
          >
            Notifications
          </div>

          {/* Notification Items */}
          <div>
            {notifications.length > 0 ? (
              notifications.map((notif, i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f0f4f8",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#00a8a8",
                        marginTop: "4px",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#2d3748",
                          lineHeight: "1.4",
                        }}
                      >
                        {notif.text}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#a0aec0",
                          marginTop: "4px",
                        }}
                      >
                        {notif.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: "24px 16px",
                  textAlign: "center",
                  color: "#a0aec0",
                  fontSize: "13px",
                }}
              >
                No notifications
              </div>
            )}
          </div>

          {/* Clear All Button */}
          {notifications.length > 0 && (
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid #e0e8f0",
                textAlign: "center",
              }}
            >
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#00a8a8",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close notifications */}
      {notifOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
          }}
          onClick={() => setNotifOpen(false)}
        />
      )}

      {/* Bottom Navigation - Mobile Only */}
      <nav className="bottom-nav">
        {navItems.map((n) => {
          const IconComponent = n.icon;
          return (
            <button
              key={n.id}
              className={`bottom-nav-item${currentPage === n.id ? " active" : ""}`}
              onClick={() => {
                setCurrentPage(n.id);
                setMobileSidebarOpen(false);
              }}
              title={n.label}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <IconComponent size={18} />
              <span style={{ fontSize: "11px" }}>{n.label.split(" ")[0]}</span>
            </button>
          );
        })}
        <button
          className="bottom-nav-item"
          onClick={onLogout}
          title="Logout"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <LogOut size={18} />
          <span style={{ fontSize: "11px" }}>Logout</span>
        </button>
      </nav>
    </div>
  );
}

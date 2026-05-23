import React, { useState, useEffect } from "react";
import { Menu, AlertCircle } from "lucide-react";
import { icons } from "./src/components/Icons";
import { LandingPage } from "./src/pages/LandingPage";
import { LoginPage } from "./src/pages/LoginPage";
import { Dashboard } from "./src/pages/Dashboard";
import { Reports } from "./src/pages/Reports";
import { Charts } from "./src/pages/Charts";
import { ClinicalHistory } from "./src/pages/ClinicalHistory";
import { AskAI } from "./src/pages/AskAI";
import { NutritionistApp } from "./src/pages/NutritionistApp";

/* ═══════ MAIN APP ═══════ */
export default function HealthAIApp() {
  console.log("HealthAIApp rendering");
  // ===== Authentication State =====
  const [authState, setAuthState] = useState("landing"); // "landing" | "login" | "authenticated"
  const [currentUser, setCurrentUser] = useState(null);

  // ===== Dashboard State (always initialize) =====
  const [page, setPage] = useState("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "agent",
      text: "Hi! I'm Vijay, your AI health assistant. Ask me anything about your fitness, nutrition, or wellness goals!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ===== Check if user is already logged in on mount =====
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setAuthState("authenticated");
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // ===== Auth Handlers =====
  const handleNavigateToLogin = () => {
    setAuthState("login");
  };

  const handleLoginSuccess = (username, role = "patient") => {
    setCurrentUser({ username, role });
    setAuthState("authenticated");
  };

  const handleBackToLanding = () => {
    setAuthState("landing");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    setAuthState("landing");
  };

  // ===== Format Text =====
  const formatText = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .split("\n")
      .map((line) => `<span>${line}</span>`)
      .join("<br/>");
  };

  // ===== Send Message to Backend =====
  const sendMessage = async (userText) => {
    if (!userText.trim() || isLoading) return;

    // 1. Immediately show the user's message
    const userMsg = { type: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Call your Flask bridge server
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          user_id: currentUser?.username || "PT-001", // use logged-in user
          stakeholder_type: "user",
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // 3. data.response is the clean final_response from your agent pipeline
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
            "Please make sure the server is running (`python server.py`) and try again.",
          hasIcon: "alert",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ===== Show Landing Page =====
  if (authState === "landing") {
    return <LandingPage onNavigateToLogin={handleNavigateToLogin} />;
  }

  // ===== Show Login Page =====
  if (authState === "login") {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  // ===== Show Nutritionist App if authenticated as nutritionist =====
  if (currentUser?.role === "nutritionist") {
    return (
      <NutritionistApp currentUser={currentUser} onLogout={handleLogout} />
    );
  }

  // ===== Show Dashboard (Authenticated Patient) =====
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: icons.dashboard },
    { id: "ask-ai", label: "Ask Vijay", icon: icons.robot },
    { id: "reports", label: "Reports", icon: icons.reports },
    { id: "charts", label: "Charts", icon: icons.charts },
    { id: "history", label: "Clinical History", icon: icons.history },
  ];

  const notifications = [
    { text: "Vijay has generated your weekly diet chart", time: "2 min ago" },
    { text: "Blood test report analyzed successfully", time: "1 hour ago" },
    { text: "You've hit 80% of your step goal today!", time: "3 hours ago" },
  ];

  const pages = {
    dashboard: <Dashboard onNavigateToAskAI={() => setPage("ask-ai")} />,
    "ask-ai": (
      <AskAI
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />
    ),
    reports: <Reports />,
    charts: <Charts />,
    history: <ClinicalHistory />,
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
      <aside className={`sidebar${mobileSidebarOpen ? " mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <img src="/logo.png" alt="MAEME Logo" className="sidebar-logo-img" />
        </div>
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {currentUser?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {currentUser?.username || "User"}
            </div>
            <div className="sidebar-user-plan">Premium Plan</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((n) => (
            <div
              key={n.id}
              className={`nav-item${page === n.id ? " active" : ""}`}
              onClick={() => {
                setPage(n.id);
                setMobileSidebarOpen(false);
              }}
            >
              {n.icon}
              {n.label}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div
            className="nav-item"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            {icons.logout} Logout
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: 1,
            }}
          >
            <button
              className="topbar-hamburger"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
              }}
              title="Menu"
            >
              <Menu size={20} />
            </button>
            <div className="topbar-title">
              {navItems.find((n) => n.id === page)?.label}
            </div>
          </div>
          <div className="topbar-right">
            <div style={{ position: "relative" }}>
              <button
                className="topbar-bell"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                {icons.bell}
                <span className="bell-badge">3</span>
              </button>
              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-header">Notifications</div>
                  {notifications.map((n, i) => (
                    <div className="notif-item" key={i}>
                      <div className="notif-dot" />
                      <div>
                        <div className="notif-text">{n.text}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <div
                className="topbar-avatar"
                onClick={() => setProfileOpen(!profileOpen)}
                style={{ cursor: "pointer" }}
              >
                {currentUser?.username?.[0]?.toUpperCase() || "U"}
              </div>
              {profileOpen && (
                <div
                  className="notif-dropdown"
                  style={{ right: 0, left: "auto" }}
                >
                  <div
                    className="notif-item"
                    onClick={handleLogout}
                    style={{ cursor: "pointer" }}
                  >
                    <div>{icons.logout}</div>
                    <div>
                      <div className="notif-text">Logout</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="page">{pages[page]}</div>
      </main>
      {/* Bottom Navigation - Mobile Only */}
      <nav className="bottom-nav">
        {navItems.map((n) => (
          <button
            key={n.id}
            className={`bottom-nav-item${page === n.id ? " active" : ""}`}
            onClick={() => setPage(n.id)}
            title={n.label}
          >
            {n.icon}
            <span>{n.label.split(" ")[0]}</span>
          </button>
        ))}
        <button
          className="bottom-nav-item"
          onClick={handleLogout}
          title="Logout"
        >
          {icons.logout}
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}

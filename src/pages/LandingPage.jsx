import { useState, useEffect } from "react";
import { icons } from "../components/Icons";

export function LandingPage({ onNavigateToLogin }) {
  const [showPopup, setShowPopup] = useState(false);

  // Show popup after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page">
      {/* Background Glows */}
      <div className="landing-glow landing-glow-1"></div>
      <div className="landing-glow landing-glow-2"></div>

      {/* Main Container */}
      <div className="landing-container">
        {/* Logo Section */}
        <div className="landing-logo-section">
          <div className="landing-logo-frame">
            <img
              src="/logo.png"
              alt="Maeme Logo"
              className="landing-logo-image"
            />
          </div>
          <p className="landing-stayed-tuned">Stayed Tuned</p>
        </div>

        {/* Main Content */}
        <div className="landing-content">
          <h1 className="landing-heading">
            Architecting the Future of Personalized Healthcare
          </h1>
          <p className="landing-description">
            MAE|ME - An AI-powered digital twin healthcare platform that
            understands you. Experience personalized health insights powered by
            advanced AI and genetic analysis.
          </p>
          <button className="landing-cta-button" onClick={onNavigateToLogin}>
            Get Started →
          </button>
        </div>

        {/* Footer */}
        <div className="landing-footer">
          <p>MAE|ME © 2026 | Olie Wellness Pvt Ltd</p>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div
          className="landing-popup-overlay"
          onClick={() => setShowPopup(false)}
        >
          <div className="landing-popup" onClick={(e) => e.stopPropagation()}>
            <button
              className="landing-popup-close"
              onClick={() => setShowPopup(false)}
            >
              ✕
            </button>
            <center>
              <h3>Welcome to MAE|ME</h3>
            </center>
            <p>
              Experience the future of personalized healthcare with our
              AI-powered digital twin platform.
            </p>
            <button
              className="landing-popup-button"
              onClick={() => {
                setShowPopup(false);
              }}
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

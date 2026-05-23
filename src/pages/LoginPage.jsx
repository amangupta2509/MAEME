import { useState } from "react";
import { icons, Icon } from "../components/Icons";
import { Eye, EyeOff, User, Stethoscope } from "lucide-react";

export function LoginPage({ onLoginSuccess, onBackToLanding }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // "patient" | "nutritionist"
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    // Simulate API call (replace with real backend later)
    setTimeout(() => {
      // Validate credentials based on role
      const isValid =
        (role === "patient" &&
          username === "maemeycdemo" &&
          password === "YCexplore@321") ||
        (role === "nutritionist" &&
          username === "nutritionist_demo" &&
          password === "Nutri@2026");

      if (isValid) {
        // Save user data to localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            username,
            role,
            loginTime: new Date().toISOString(),
          }),
        );
        setIsLoading(false);
        onLoginSuccess(username, role);
      } else {
        setError("Invalid username or password");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="login-page">
      {/* Background Glows */}
      <div className="login-glow login-glow-1"></div>
      <div className="login-glow login-glow-2"></div>

      {/* Login Container */}
      <div className="login-container">
        {/* Start Over Button */}
        <button
          className="login-back-button"
          onClick={onBackToLanding}
          title="Start Over"
        >
          ← Start Over
        </button>

        {/* Logo */}
        <div className="login-logo">
          <img src="/logo.png" alt="Maeme Logo" className="login-logo-image" />
        </div>

        {/* Heading */}
        <h1 className="login-title">Welcome to MAE|ME</h1>
        <p className="login-subtitle">Sign in to your account to continue</p>

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
          {/* Error Message */}
          {error && (
            <div className="login-error-message">
              <Icon d={icons.close} size={16} stroke="#dc3545" />
              {error}
            </div>
          )}

          {/* Username Field */}
          <div className="login-form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              disabled={isLoading}
              autoComplete="off"
            />
          </div>

          {/* Password Field */}
          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <div className="login-password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* Role Selector */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            <button
              type="button"
              className={role === "patient" ? "btn-primary" : "btn-outline"}
              onClick={() => setRole("patient")}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              disabled={isLoading}
            >
              <User size={18} /> Patient
            </button>
            <button
              type="button"
              className={
                role === "nutritionist" ? "btn-primary" : "btn-outline"
              }
              onClick={() => setRole("nutritionist")}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              disabled={isLoading}
            >
              <Stethoscope size={18} /> Nutritionist
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="login-spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2026 MAE|ME | Olie Wellness Pvt Ltd</p>
        </div>
      </div>
    </div>
  );
}

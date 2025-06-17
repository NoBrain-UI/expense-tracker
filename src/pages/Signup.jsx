import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const generateCaptcha = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setInputCaptcha("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (inputCaptcha !== captcha) {
      setError("Captcha does not match.");
      refreshCaptcha();
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      // ✅ Immediately sign out so user is redirected to login manually
      await signOut(auth);

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.outer}>
      <div style={styles.backgroundPattern}></div>
      <div style={styles.card}>
        <div style={styles.headerSection}>
          <div style={styles.iconWrapper}>
            <div style={styles.icon}>🚀</div>
          </div>
          <h2 style={styles.heading}>Join Us Today</h2>
          <p style={styles.subtext}>Start your journey to financial freedom</p>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠️</span>
            <p style={styles.error}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>📧</span>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* CAPTCHA Block */}
          <div style={styles.captchaSection}>
            <label style={styles.captchaLabel}>Security Verification</label>
            <div style={styles.captchaBox}>
              <div style={styles.captchaDisplay}>
                <div style={styles.captcha}>{captcha}</div>
                <div style={styles.captchaPattern}></div>
              </div>
              <button
                type="button"
                onClick={refreshCaptcha}
                style={styles.refreshBtn}
                title="Refresh CAPTCHA"
              >
                🔄
              </button>
            </div>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔐</span>
              <input
                type="text"
                placeholder="Enter the code above"
                value={inputCaptcha}
                onChange={(e) => setInputCaptcha(e.target.value.toUpperCase())}
                style={styles.input}
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            <span style={styles.buttonText}>Create Account</span>
            <span style={styles.buttonIcon}>✨</span>
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine}></div>
        </div>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Sign in here
          </span>
        </p>

        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>💳</span>
            <span style={styles.featureText}>Track Expenses</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📊</span>
            <span style={styles.featureText}>Visual Reports</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🎯</span>
            <span style={styles.featureText}>Budget Goals</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  outer: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    position: "relative",
    overflow: "hidden",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `
      radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255,255,255,0.03) 0%, transparent 50%)
    `,
    pointerEvents: "none",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    padding: "3rem 2.5rem",
    borderRadius: "24px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)",
    width: "100%",
    maxWidth: "450px",
    position: "relative",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  headerSection: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  iconWrapper: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "64px",
    height: "64px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    borderRadius: "50%",
    marginBottom: "1rem",
    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
  },
  icon: {
    fontSize: "1.5rem",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: "0.5rem",
    background: "linear-gradient(135deg, #1F2937, #374151)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtext: {
    color: "#6B7280",
    fontSize: "1rem",
    fontWeight: "400",
  },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "#FEF2F2",
    color: "#DC2626",
    padding: "1rem",
    borderRadius: "12px",
    marginBottom: "1.5rem",
    border: "1px solid #FECACA",
  },
  errorIcon: {
    fontSize: "1.1rem",
  },
  error: {
    margin: 0,
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    fontSize: "1rem",
    zIndex: 1,
    color: "#9CA3AF",
  },
  input: {
    width: "100%",
    padding: "16px 16px 16px 48px",
    fontSize: "1rem",
    borderRadius: "12px",
    border: "2px solid #E5E7EB",
    backgroundColor: "#FAFAFA",
    transition: "all 0.3s ease",
    outline: "none",
    fontWeight: "400",
    boxSizing: "border-box",
  },
  captchaSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  captchaLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.5rem",
  },
  captchaBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0FDF4",
    padding: "16px",
    borderRadius: "12px",
    border: "2px solid #BBF7D0",
    position: "relative",
    overflow: "hidden",
  },
  captchaDisplay: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  captcha: {
    fontFamily: "'Courier New', monospace",
    fontSize: "1.4rem",
    fontWeight: "bold",
    letterSpacing: "4px",
    color: "#1F2937",
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
    position: "relative",
    zIndex: 2,
  },
  captchaPattern: {
    position: "absolute",
    top: "50%",
    left: "0",
    width: "100%",
    height: "2px",
    background:
      "repeating-linear-gradient(90deg, #BBF7D0 0px, #BBF7D0 5px, transparent 5px, transparent 10px)",
    transform: "translateY(-50%) rotate(-10deg)",
    opacity: 0.3,
  },
  refreshBtn: {
    background: "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
    border: "2px solid #D1D5DB",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "16px 24px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
    position: "relative",
    overflow: "hidden",
  },
  buttonText: {
    position: "relative",
    zIndex: 1,
  },
  buttonIcon: {
    fontSize: "1.2rem",
    transition: "transform 0.2s ease",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "2rem 0 1.5rem 0",
    gap: "1rem",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, #E5E7EB, transparent)",
  },
  dividerText: {
    color: "#9CA3AF",
    fontSize: "0.9rem",
    fontWeight: "500",
    padding: "0 0.5rem",
  },
  loginText: {
    textAlign: "center",
    fontSize: "0.95rem",
    color: "#6B7280",
    fontWeight: "400",
    marginBottom: "2rem",
  },
  link: {
    color: "#10b981",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    borderBottom: "1px solid transparent",
    transition: "all 0.2s ease",
    paddingBottom: "1px",
  },
  features: {
    display: "flex",
    justifyContent: "space-around",
    gap: "1rem",
    marginTop: "1.5rem",
    padding: "1.5rem 0",
    borderTop: "1px solid #E5E7EB",
  },
  feature: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    flex: 1,
  },
  featureIcon: {
    fontSize: "1.5rem",
    background: "linear-gradient(135deg, #10b981, #059669)",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
  },
  featureText: {
    fontSize: "0.8rem",
    color: "#6B7280",
    fontWeight: "500",
    textAlign: "center",
  },
};

// Add hover effects via CSS-in-JS approach
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    input:focus {
      border-color: #10b981 !important;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
      background-color: white !important;
    }
    
    button[type="submit"]:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4) !important;
    }
    
    button[type="submit"]:hover span:last-child {
      transform: scale(1.2) !important;
    }
    
    button[type="button"]:hover {
      transform: scale(1.05) !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
    }
    
    .link:hover {
      border-bottom-color: #10b981 !important;
      color: #059669 !important;
    }
    
    .feature:hover .featureIcon {
      transform: scale(1.1) !important;
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3) !important;
    }
  `;
  if (!document.head.querySelector("style[data-signup-styles]")) {
    styleSheet.setAttribute("data-signup-styles", "true");
    document.head.appendChild(styleSheet);
  }
}

export default Signup;

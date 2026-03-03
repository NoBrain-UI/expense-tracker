import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
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

const Login = () => {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (inputCaptcha !== captcha) {
      setError("Security code does not match.");
      refreshCaptcha();
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Background Glows */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.glassCard}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>💰</div>
          <h2 style={styles.heading}>Welcome Back</h2>
          <p style={styles.subtext}>Secure access to your FinanceEdge dashboard</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <span style={{ marginRight: "10px" }}>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Styled CAPTCHA Section */}
          <div style={styles.captchaSection}>
            <div style={styles.captchaRow}>
              <div style={styles.captchaDisplay}>
                <span style={styles.captchaText}>{captcha}</span>
                <div style={styles.noiseOverlay}></div>
              </div>
              <button type="button" onClick={refreshCaptcha} style={styles.refreshBtn}>
                🔄
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter security code"
              value={inputCaptcha}
              onChange={(e) => setInputCaptcha(e.target.value.toUpperCase())}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            Sign In to Account
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            New to FinanceEdge?{" "}
            <span style={styles.link} onClick={() => navigate("/signup")}>
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#050505",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "20px",
  },
  blob1: {
    position: "absolute",
    top: "-10%",
    right: "-5%",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(0, 198, 255, 0.1) 0%, transparent 70%)",
  },
  blob2: {
    position: "absolute",
    bottom: "10%",
    left: "-5%",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(0, 255, 213, 0.07) 0%, transparent 70%)",
  },
  glassCard: {
    width: "100%",
    maxWidth: "440px",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    borderRadius: "32px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "40px",
    zIndex: 1,
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
  header: {
    textAlign: "center",
    marginBottom: "35px",
  },
  logoBadge: {
    width: "50px",
    height: "50px",
    background: "linear-gradient(135deg, #00c6ff, #0072ff)",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    margin: "0 auto 15px",
    boxShadow: "0 8px 16px rgba(0, 114, 255, 0.3)",
  },
  heading: {
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },
  subtext: {
    color: "#666",
    fontSize: "0.95rem",
  },
  errorBox: {
    background: "rgba(255, 69, 58, 0.1)",
    color: "#ff453a",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    marginBottom: "25px",
    border: "1px solid rgba(255, 69, 58, 0.2)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#aaa",
    marginLeft: "4px",
  },
  input: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "14px",
    padding: "14px 16px",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
  },
  captchaSection: {
    background: "rgba(255, 255, 255, 0.02)",
    padding: "15px",
    borderRadius: "18px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  captchaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  captchaDisplay: {
    background: "#111",
    padding: "10px 20px",
    borderRadius: "10px",
    position: "relative",
    overflow: "hidden",
    border: "1px solid #222",
    flex: 1,
    marginRight: "10px",
    display: "flex",
    justifyContent: "center",
  },
  captchaText: {
    fontFamily: "'Courier New', monospace",
    fontSize: "1.4rem",
    fontWeight: "900",
    letterSpacing: "6px",
    color: "#00ffd5",
    fontStyle: "italic",
    zIndex: 2,
    position: "relative",
  },
  noiseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.1,
    background: "repeating-linear-gradient(45deg, #fff, #fff 1px, transparent 1px, transparent 5px)",
  },
  refreshBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#fff",
  },
  submitBtn: {
    background: "#fff",
    color: "#000",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "10px",
    transition: "all 0.3s ease",
  },
  footer: {
    marginTop: "30px",
    textAlign: "center",
  },
  footerText: {
    color: "#666",
    fontSize: "0.9rem",
  },
  link: {
    color: "#00c6ff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },
};

export default Login;
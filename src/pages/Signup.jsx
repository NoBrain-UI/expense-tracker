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
      setError("Security code does not match.");
      refreshCaptcha();
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await signOut(auth); // Sign out so they can log in fresh
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Background Glows - Monochromatic */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>
      <div style={styles.blob3}></div>

      <div style={styles.glassCard}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>🚀</div>
          <h2 style={styles.heading}>Create Account</h2>
          <p style={styles.subtext}>Join the future of smart expense tracking</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <span style={{ marginRight: "10px" }}>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
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
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* CAPTCHA Section - Monochromatic */}
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
              placeholder="Verify security code"
              value={inputCaptcha}
              onChange={(e) => setInputCaptcha(e.target.value.toUpperCase())}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            Create Free Account
          </button>
        </form>

        <div style={styles.divider}>
            <div style={styles.line}></div>
            <span style={styles.or}>OR</span>
            <div style={styles.line}></div>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already a member?{" "}
            <span style={styles.link} onClick={() => navigate("/login")}>
              Sign in here
            </span>
          </p>
        </div>

        {/* Feature Highlights - Greyscale */}
        <div style={styles.featurePills}>
            <div style={styles.pill}>💳 Tracking</div>
            <div style={styles.pill}>📊 Insights</div>
            <div style={styles.pill}>🛡️ Secure</div>
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
    left: "-5%",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)", // Dialed down to 3% white
  },
  blob2: {
    position: "absolute",
    bottom: "10%",
    right: "-5%",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)", // Dialed down to 2% white
  },
  blob3: {
    position: "absolute",
    top: "30%",
    right: "30%",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(255, 255, 255, 0.01) 0%, transparent 70%)", // Dialed down to 1% white
  },
  glassCard: {
    width: "100%",
    maxWidth: "450px",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(25px)",
    borderRadius: "32px",
    border: "1px solid rgba(255, 255, 255, 0.06)", // Fainter border
    padding: "40px",
    zIndex: 1,
    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logoBadge: {
    width: "55px",
    height: "55px",
    background: "linear-gradient(135deg, #eee, #999)", // Greyscale gradient
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
    margin: "0 auto 15px",
    boxShadow: "0 8px 20px rgba(255, 255, 255, 0.1)",
  },
  heading: {
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },
  subtext: {
    color: "#555", // Darker subtext
    fontSize: "0.95rem",
  },
  errorBox: {
    background: "rgba(255, 69, 58, 0.1)", // Kept error red for functional feedback
    color: "#ff453a",
    padding: "14px",
    borderRadius: "14px",
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
    color: "#777", // Darker label
    marginLeft: "4px",
  },
  input: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.08)", // Fainter border
    borderRadius: "14px",
    padding: "14px 16px",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
  },
  captchaSection: {
    background: "rgba(255, 255, 255, 0.01)", // Darker section
    padding: "15px",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.03)", // Fainter border
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
    background: "#0a0a0a", // Deeper black
    padding: "10px 20px",
    borderRadius: "12px",
    position: "relative",
    overflow: "hidden",
    border: "1px solid #111",
    flex: 1,
    marginRight: "10px",
    display: "flex",
    justifyContent: "center",
  },
  captchaText: {
    fontFamily: "'Courier New', monospace",
    fontSize: "1.5rem",
    fontWeight: "900",
    letterSpacing: "6px",
    color: "#eee", // Grey text
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
    background: "repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 10px)",
  },
  refreshBtn: {
    background: "rgba(255,255,255,0.03)",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#777", // Grey text
  },
  submitBtn: {
    background: "#fff",
    color: "#000",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "800", // Bolder text
    cursor: "pointer",
    marginTop: "10px",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 20px rgba(255, 255, 255, 0.05)",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "25px 0",
  },
  line: { flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" },
  or: { fontSize: "0.8rem", color: "#444", fontWeight: "600" },
  footer: {
    textAlign: "center",
    marginBottom: "25px"
  },
  footerText: {
    color: "#555", // Darker text
    fontSize: "0.9rem",
  },
  link: {
    color: "#eee", // White link
    fontWeight: "600",
    cursor: "pointer",
  },
  featurePills: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      paddingTop: "20px"
  },
  pill: {
      fontSize: "0.75rem",
      background: "rgba(255,255,255,0.03)",
      padding: "6px 12px",
      borderRadius: "100px",
      color: "#555", // Greyscale text
      border: "1px solid rgba(255,255,255,0.05)"
  }
};

export default Signup;
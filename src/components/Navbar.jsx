import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo} onClick={() => navigate("/")}>
        FinanceEdge<span style={{ color: "#fff" }}>.</span>
      </div>

      <div style={styles.navLinks}>
        {currentUser ? (
          <>
            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
            <Link to="/add-transaction" style={styles.navLink}>Add Transaction</Link>
            <Link to="/add-category" style={styles.navLink}>Categories</Link>
            <Link to="/profile" style={styles.navLink}>Profile</Link>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button style={styles.loginBtn} onClick={() => navigate("/login")}>
              Login
            </button>
            <button style={styles.signupBtn} onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 6%",
    height: "80px", // Fixed height is crucial
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    boxSizing: "border-box",
    backdropFilter: "blur(20px)",
    backgroundColor: "rgba(5, 5, 5, 0.8)", 
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    zIndex: 2000, // Very high z-index to stay on top
  },
  logo: {
    fontSize: "1.4rem",
    fontWeight: "900",
    letterSpacing: "-1px",
    cursor: "pointer",
    color: "#fff",
    textTransform: "uppercase"
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },
  navLink: {
    fontSize: "0.85rem",
    color: "#777",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
  loginBtn: {
    background: "transparent",
    color: "#fff",
    border: "1px solid #222",
    padding: "10px 22px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  signupBtn: {
    background: "#fff",
    color: "#000",
    border: "none",
    padding: "10px 22px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "800",
    cursor: "pointer",
  },
  logoutBtn: {
    background: "rgba(255, 255, 255, 0.05)",
    color: "#eee",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "8px 18px",
    borderRadius: "10px",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Navbar;
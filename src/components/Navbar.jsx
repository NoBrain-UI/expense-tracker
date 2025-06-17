import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./css/Navbar.css";

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
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        FinanceEdge
      </div>

      <div className="nav-links">
        {currentUser ? (
          <>
            <Link to="/add-transaction" className="link">
              Add Transaction
            </Link>
            <Link to="/add-category" className="link">
              Add Category
            </Link>
            <Link to="/profile" className="link">
              Profile
            </Link>
            <Link to="/dashboard" className="link">
              Dashboard
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

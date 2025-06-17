import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const defaultCategories = ["Food", "Travel", "Bills", "Shopping", "Health"];

const AddTransaction = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn("⚠️ No user logged in.");
        setUser(null);
        return;
      }

      console.log("✅ User detected:", user);
      setUser(user);

      try {
        const q = query(
          collection(db, "categories"),
          where("uid", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const custom = snapshot.docs.map((doc) => doc.data().name);
        setCategories([...defaultCategories, ...custom]);
      } catch (err) {
        console.error("🔥 Error fetching categories:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to add a transaction.");
      return;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "transactions"), {
        title,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date(date),
        createdAt: new Date(),
      });

      alert("✅ Transaction added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error adding transaction:", err);
      alert("Failed to add transaction");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <span style={styles.icon}>💰</span>
          </div>
          <h2 style={styles.heading}>Add New Transaction</h2>
          <p style={styles.subtitle}>Track your income and expenses</p>
        </div>

        {!user ? (
          <div style={styles.loginPrompt}>
            <div style={styles.lockIcon}>🔒</div>
            <p style={styles.loginText}>Please log in to add a transaction</p>
          </div>
        ) : (
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Transaction Title</label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g., Grocery shopping, Salary, Coffee..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Amount</label>
              <div style={styles.amountContainer}>
                <span style={styles.currencySymbol}>$</span>
                <input
                  style={styles.amountInput}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.halfWidth}>
                <label style={styles.label}>Type</label>
                <select
                  style={{
                    ...styles.select,
                    background:
                      type === "income"
                        ? "linear-gradient(135deg, #10b981, #059669)"
                        : "#ffffff",
                    color: type === "income" ? "white" : "#374151",
                    border:
                      type === "expense"
                        ? "2px solid #f97316"
                        : "2px solid #e5e7eb",
                    boxShadow:
                      type === "expense"
                        ? "0 0 0 3px rgba(249, 115, 22, 0.1)"
                        : "none",
                  }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option
                    value="expense"
                    style={{ background: "#ffffff", color: "#374151" }}
                  >
                    💸 Expense
                  </option>
                  <option
                    value="income"
                    style={{ background: "#059669", color: "white" }}
                  >
                    💵 Income
                  </option>
                </select>
              </div>

              <div style={styles.halfWidth}>
                <label style={styles.label}>Category</label>
                <select
                  style={styles.select}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">🏷️ Select Category</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {getCategoryIcon(cat)} {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Date & Time</label>
              <input
                style={styles.input}
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <button style={styles.button} type="submit">
              <span style={styles.buttonIcon}>✨</span>
              Add Transaction
              <span style={styles.buttonIcon}>→</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const getCategoryIcon = (category) => {
  const icons = {
    Food: "🍽️",
    Travel: "✈️",
    Bills: "📄",
    Shopping: "🛍️",
    Health: "🏥",
  };
  return icons[category] || "📋";
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "2rem 1rem",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "2rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  iconContainer: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
    boxShadow: "0 8px 24px rgba(240, 147, 251, 0.3)",
  },
  icon: {
    fontSize: "2rem",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 0.5rem 0",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "1rem",
    margin: 0,
  },
  loginPrompt: {
    textAlign: "center",
    padding: "3rem 2rem",
    background: "linear-gradient(135deg, #fee2e2, #fecaca)",
    borderRadius: "16px",
    border: "1px solid #fca5a5",
  },
  lockIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  loginText: {
    color: "#dc2626",
    fontSize: "1.1rem",
    fontWeight: "500",
    margin: 0,
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
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.25rem",
  },
  input: {
    padding: "16px 20px",
    fontSize: "1rem",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    background: "#ffffff",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "inherit",
  },
  amountContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  currencySymbol: {
    position: "absolute",
    left: "20px",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#6b7280",
    zIndex: 1,
  },
  amountInput: {
    padding: "16px 20px 16px 40px",
    fontSize: "1rem",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    background: "#ffffff",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
  },
  row: {
    display: "flex",
    gap: "1rem",
  },
  halfWidth: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  select: {
    padding: "16px 20px",
    fontSize: "1rem",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    background: "#ffffff",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "inherit",
    cursor: "pointer",
  },
  button: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    padding: "18px 24px",
    fontSize: "1.1rem",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontFamily: "inherit",
    boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
    marginTop: "1rem",
  },
  buttonIcon: {
    fontSize: "1rem",
  },
};

// Add hover effects using CSS-in-JS approach
const originalButton = styles.button;
styles.button = {
  ...originalButton,
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 32px rgba(16, 185, 129, 0.4)",
  },
};

// Add focus effects for inputs
const inputFocusStyle = `
  input:focus, select:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    transform: translateY(-1px);
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.4);
  }
  
  button:active {
    transform: translateY(0);
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = inputFocusStyle;
  document.head.appendChild(styleSheet);
}

export default AddTransaction;

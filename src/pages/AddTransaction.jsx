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
        setUser(null);
        return;
      }
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
        console.error("Error fetching categories:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, "users", user.uid, "transactions"), {
        title,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date(date),
        createdAt: new Date(),
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Global CSS Injection for the Dropdown Fix */}
      <style>
        {`
          select option {
            background-color: #111 !important;
            color: #fff !important;
          }
          input:focus, select:focus {
            border-color: #fff !important;
            background-color: rgba(255,255,255,0.08) !important;
          }
        `}
      </style>

      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.iconBadge}>💰</div>
          <h2 style={styles.heading}>New Transaction</h2>
          <p style={styles.subtext}>Record your daily capital movement</p>
        </div>

        {!user ? (
          <div style={styles.glassCard}>
            <p style={{ textAlign: "center", color: "#666" }}>
              Please log in to continue.
            </p>
          </div>
        ) : (
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.glassCard}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Description</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g. Starbucks, Monthly Rent..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Amount (INR)</label>
                <div style={styles.amountWrapper}>
                  <span style={styles.currency}>₹</span>
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
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Type</label>
                  <select
                    style={
                      type === "income"
                        ? styles.selectIncome
                        : styles.selectExpense
                    }
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Category</label>
                  <select
                    style={styles.select}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select...</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Timestamp</label>
                <input
                  style={styles.input}
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <button style={styles.submitBtn} type="submit">
                Complete Transaction
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#050505",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    paddingTop: "120px",
    paddingBottom: "60px",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    top: "-10%",
    right: "-5%",
    width: "500px",
    height: "500px",
    background:
      "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)",
  },
  blob2: {
    position: "absolute",
    bottom: "10%",
    left: "-5%",
    width: "600px",
    height: "600px",
    background:
      "radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)",
  },
  container: {
    maxWidth: "550px",
    margin: "0 auto",
    padding: "0 20px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  iconBadge: {
    width: "50px",
    height: "50px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    margin: "0 auto 15px",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "900",
    letterSpacing: "-2px",
    marginBottom: "8px",
  },
  subtext: {
    color: "#444",
    fontSize: "1rem",
  },
  glassCard: {
    background: "rgba(255, 255, 255, 0.02)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "32px",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginLeft: "4px",
  },
  input: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "14px",
    padding: "16px",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    transition: "0.3s",
  },
  amountWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  currency: {
    position: "absolute",
    left: "18px",
    fontSize: "1.2rem",
    color: "#888",
    fontWeight: "600",
  },
  amountInput: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "14px",
    padding: "16px 16px 16px 45px",
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: "700",
    outline: "none",
  },
  row: {
    display: "flex",
    gap: "15px",
  },
  select: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "14px",
    padding: "16px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    cursor: "pointer",
  },
  selectExpense: {
    width: "100%",
    background: "rgba(255, 69, 58, 0.05)",
    border: "1px solid rgba(255, 69, 58, 0.2)",
    borderRadius: "14px",
    padding: "16px",
    color: "#ff453a",
    fontSize: "0.95rem",
    fontWeight: "700",
    outline: "none",
    cursor: "pointer",
  },
  selectIncome: {
    width: "100%",
    background: "rgba(0, 255, 213, 0.05)",
    border: "1px solid rgba(0, 255, 213, 0.2)",
    borderRadius: "14px",
    padding: "16px",
    color: "#00ffd5",
    fontSize: "0.95rem",
    fontWeight: "700",
    outline: "none",
    cursor: "pointer",
  },
  submitBtn: {
    background: "#fff",
    color: "#000",
    border: "none",
    padding: "18px",
    borderRadius: "16px",
    fontSize: "1rem",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.3s",
  },
};

export default AddTransaction;
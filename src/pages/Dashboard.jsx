import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid, // Added for visibility
} from "recharts";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const userTransactionsRef = collection(db, "users", user.uid, "transactions");

      const unsubscribeFirestore = onSnapshot(userTransactionsRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(data);
        setLoading(false);
      });

      return () => unsubscribeFirestore();
    });

    return () => unsubscribe();
  }, []);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const expense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  // Neon contrast colors for dark theme
  const COLORS = ["#00ffd5", "#ff453a"]; 

  const categoryMap = {};
  expenseTransactions.forEach((t) => {
    if (!categoryMap[t.category]) categoryMap[t.category] = 0;
    categoryMap[t.category] += t.amount;
  });

  const categoryData = Object.entries(categoryMap).map(([cat, amt]) => ({
    category: cat,
    amount: amt,
  }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>⏳</div>
        <p style={styles.loadingText}>Analyzing accounts...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerBadge}>DASHBOARD</div>
          <h1 style={styles.heading}>Financial Overview</h1>
          <p style={styles.subtitle}>Real-time monitoring of your capital flow</p>
        </header>

        <div style={styles.summaryGrid}>
          <SummaryCard label="Total Income" value={formatCurrency(income)} icon="📈" />
          <SummaryCard label="Total Expenses" value={formatCurrency(expense)} icon="📉" />
          <div style={balance < 0 ? styles.balanceCardNegative : styles.balanceCard}>
            <p style={styles.cardLabel}>Net Balance</p>
            <h2 style={styles.cardValue}>{formatCurrency(balance)}</h2>
            <div style={styles.cardStatus}>{balance >= 0 ? "SURPLUS" : "DEFICIT"}</div>
          </div>
        </div>

        <div style={styles.chartsGrid}>
          {/* Pie Chart Card */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Wealth Allocation</h3>
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={styles.tooltipContent}
                    itemStyle={{ color: "#fff" }}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart Card */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Spending by Category</h3>
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="category" 
                    stroke="#555" 
                    tick={{ fill: '#888', fontSize: 12 }} 
                    axisLine={{ stroke: '#222' }}
                  />
                  <YAxis 
                    stroke="#555" 
                    tick={{ fill: '#888', fontSize: 12 }} 
                    axisLine={{ stroke: '#222' }}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={styles.tooltipContent}
                  />
                  <Bar dataKey="amount" fill="#fff" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link to="/add-transaction" style={{ textDecoration: "none" }}>
            <button style={styles.actionBtn}>New Transaction</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, icon }) => (
  <div style={styles.glassCard}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <p style={styles.cardLabel}>{label}</p>
      <span>{icon}</span>
    </div>
    <h2 style={styles.cardValue}>{value}</h2>
  </div>
);

const styles = {
  // ... (previous pageWrapper, blobs, and container styles)
  pageWrapper: { minHeight: "100vh", backgroundColor: "#050505", color: "#fff", fontFamily: "'Inter', sans-serif", paddingTop: "120px", paddingBottom: "80px", position: "relative", overflow: "hidden" },
  blob1: { position: "absolute", top: "-10%", right: "-5%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)" },
  blob2: { position: "absolute", bottom: "10%", left: "-5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1 },
  header: { textAlign: "center", marginBottom: "60px" },
  headerBadge: { fontSize: "0.75rem", fontWeight: "800", letterSpacing: "2px", color: "#555", marginBottom: "10px" },
  heading: { fontSize: "3rem", fontWeight: "900", letterSpacing: "-2px", marginBottom: "10px" },
  subtitle: { color: "#666", fontSize: "1.1rem" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "40px" },
  glassCard: { background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "24px", padding: "30px" },
  balanceCard: { background: "#fff", color: "#000", borderRadius: "24px", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  balanceCardNegative: { background: "rgba(255, 69, 58, 0.1)", border: "1px solid #ff453a", color: "#ff453a", borderRadius: "24px", padding: "30px" },
  cardLabel: { fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px", opacity: 0.7 },
  cardValue: { fontSize: "2rem", fontWeight: "800", margin: 0 },
  cardStatus: { fontSize: "0.7rem", fontWeight: "900", marginTop: "15px", letterSpacing: "1px" },

  chartsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "30px" },
  chartCard: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "32px",
    padding: "30px",
    display: "flex",
    flexDirection: "column"
  },
  chartTitle: { fontSize: "0.8rem", fontWeight: "700", marginBottom: "20px", color: "#555", textTransform: "uppercase", letterSpacing: "1px" },
  tooltipContent: {
    backgroundColor: "#111", 
    border: "1px solid #333", 
    borderRadius: "12px", 
    fontSize: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  },
  actionBtn: { background: "#fff", color: "#000", border: "none", padding: "16px 40px", borderRadius: "14px", fontWeight: "800", fontSize: "1rem", cursor: "pointer", transition: "0.3s" },
  loadingContainer: { minHeight: "100vh", backgroundColor: "#050505", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  spinner: { fontSize: "2rem", marginBottom: "20px" },
  loadingText: { color: "#444", fontWeight: "600" }
};

export default Dashboard;
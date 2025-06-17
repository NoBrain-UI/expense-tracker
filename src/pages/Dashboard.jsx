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
} from "recharts";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const userTransactionsRef = collection(
        db,
        "users",
        user.uid,
        "transactions"
      );

      const unsubscribeFirestore = onSnapshot(
        userTransactionsRef,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTransactions(data);
          setLoading(false);
        }
      );

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

  const COLORS = ["#10B981", "#EF4444"];

  // Group expense by category
  const categoryMap = {};
  expenseTransactions.forEach((t) => {
    if (!categoryMap[t.category]) categoryMap[t.category] = 0;
    categoryMap[t.category] += t.amount;
  });

  const categoryData = Object.entries(categoryMap).map(([cat, amt]) => ({
    category: cat,
    amount: amt,
  }));

  const highestCategory =
    categoryData.length > 0
      ? categoryData.reduce((a, b) => (a.amount > b.amount ? a : b)).category
      : null;

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
        <p style={styles.loadingText}>Loading your financial data...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <span style={styles.headerIcon}>📊</span>
          </div>
          <h2 style={styles.heading}>Financial Dashboard</h2>
          <p style={styles.subtitle}>
            Track your income, expenses, and savings
          </p>
        </div>

        {/* Summary Cards */}
        <div style={styles.summaryGrid}>
          <div style={styles.incomeCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>💰</span>
              <span style={styles.cardLabel}>Total Income</span>
            </div>
            <div style={styles.cardValue}>{formatCurrency(income)}</div>
            <div style={styles.cardTrend}>
              <span style={styles.trendIcon}>📈</span>
              <span style={styles.trendText}>Money In</span>
            </div>
          </div>

          <div style={styles.expenseCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>💸</span>
              <span style={styles.cardLabel}>Total Expenses</span>
            </div>
            <div style={styles.cardValue}>{formatCurrency(expense)}</div>
            <div style={styles.cardTrend}>
              <span style={styles.trendIcon}>📉</span>
              <span style={styles.trendText}>Money Out</span>
            </div>
          </div>

          <div
            style={{
              ...styles.balanceCard,
              ...(balance < 0
                ? styles.negativeBalance
                : styles.positiveBalance),
            }}
          >
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>🧮</span>
              <span style={styles.cardLabel}>Net Balance</span>
            </div>
            <div style={styles.cardValue}>{formatCurrency(balance)}</div>
            <div style={styles.cardTrend}>
              <span style={styles.trendIcon}>{balance >= 0 ? "✅" : "⚠️"}</span>
              <span style={styles.trendText}>
                {balance >= 0 ? "Healthy" : "Deficit"}
              </span>
            </div>
          </div>
        </div>

        {/* Smart Suggestion */}
        {highestCategory && (
          <div style={styles.suggestionCard}>
            <div style={styles.suggestionHeader}>
              <span style={styles.suggestionIcon}>💡</span>
              <span style={styles.suggestionTitle}>Smart Insight</span>
            </div>
            <p style={styles.suggestionText}>
              Your highest spending category is{" "}
              <strong>{highestCategory}</strong> with{" "}
              {formatCurrency(categoryMap[highestCategory])}. Consider reducing
              expenses in this area to boost your savings!
            </p>
          </div>
        )}

        {/* Action Button */}
        <div style={styles.actionSection}>
          <Link to="/add-transaction" style={styles.linkButton}>
            <button
              style={styles.addButton}
              onMouseEnter={(e) => {
                e.target.style.transform = styles.addButtonHover.transform;
                e.target.style.boxShadow = styles.addButtonHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = styles.addButton.transform;
                e.target.style.boxShadow = styles.addButton.boxShadow;
              }}
            >
              <span style={styles.buttonIcon}>➕</span>
              Add New Transaction
            </button>
          </Link>
        </div>

        {/* Charts Section */}
        <div style={styles.chartsGrid}>
          {/* Pie Chart */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <span style={styles.chartIcon}>🥧</span>
              <h3 style={styles.chartTitle}>Income vs Expenses</h3>
            </div>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) =>
                      `${name}: ${formatCurrency(value)}`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          {categoryData.length > 0 && (
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <span style={styles.chartIcon}>📊</span>
                <h3 style={styles.chartTitle}>Spending by Category</h3>
              </div>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar
                      dataKey="amount"
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#764ba2" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {transactions.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <h3 style={styles.emptyTitle}>No Transactions Yet</h3>
            <p style={styles.emptyText}>
              Start tracking your finances by adding your first transaction!
            </p>
            <Link to="/add-transaction" style={styles.linkButton}>
              <button style={styles.emptyButton}>
                <span style={styles.buttonIcon}>🚀</span>
                Get Started
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
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
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
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
  headerIcon: {
    fontSize: "2rem",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "white",
    margin: "0 0 0.5rem 0",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "1.1rem",
    margin: 0,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    marginBottom: "3rem",
  },
  incomeCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "2rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderLeft: "6px solid #10B981",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  expenseCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "2rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderLeft: "6px solid #EF4444",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  balanceCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "2rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  positiveBalance: {
    borderLeft: "6px solid #10B981",
  },
  negativeBalance: {
    borderLeft: "6px solid #F59E0B",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  cardIcon: {
    fontSize: "1.5rem",
  },
  cardLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  cardValue: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: "0.5rem",
  },
  cardTrend: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  trendIcon: {
    fontSize: "1rem",
  },
  trendText: {
    fontSize: "0.9rem",
    color: "#6B7280",
    fontWeight: "500",
  },
  suggestionCard: {
    background: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    borderRadius: "20px",
    padding: "2rem",
    marginBottom: "3rem",
    border: "2px solid #F59E0B",
    boxShadow: "0 12px 28px rgba(245, 158, 11, 0.2)",
  },
  suggestionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  suggestionIcon: {
    fontSize: "1.5rem",
  },
  suggestionTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#92400E",
  },
  suggestionText: {
    fontSize: "1rem",
    color: "#78350F",
    lineHeight: "1.6",
    margin: 0,
  },
  actionSection: {
    textAlign: "center",
    marginBottom: "3rem",
  },
  linkButton: {
    textDecoration: "none",
  },
  addButton: {
    background: "linear-gradient(135deg, #10B981, #059669)",
    color: "white",
    padding: "16px 32px",
    fontSize: "1.1rem",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    fontFamily: "inherit",
    boxShadow: "0 12px 32px rgba(16, 185, 129, 0.3)",
    transform: "scale(1)",
    margin: "0 auto",
  },
  addButtonHover: {
    transform: "scale(1.05)",
    boxShadow: "0 16px 40px rgba(16, 185, 129, 0.4)",
  },
  buttonIcon: {
    fontSize: "1.2rem",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "2rem",
    marginBottom: "3rem",
  },
  chartCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "2rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  chartHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #F3F4F6",
  },
  chartIcon: {
    fontSize: "1.5rem",
  },
  chartTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#374151",
    margin: 0,
  },
  chartContainer: {
    background: "#FAFAFA",
    borderRadius: "16px",
    padding: "1rem",
  },
  emptyState: {
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "4rem 2rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "1rem",
  },
  emptyText: {
    fontSize: "1rem",
    color: "#6B7280",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },
  emptyButton: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    padding: "16px 32px",
    fontSize: "1.1rem",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    fontFamily: "inherit",
    boxShadow: "0 12px 32px rgba(102, 126, 234, 0.3)",
    margin: "0 auto",
  },
  loadingContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  spinner: {
    fontSize: "3rem",
    marginBottom: "1rem",
    animation: "spin 2s linear infinite",
  },
  loadingText: {
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "500",
  },
};

// Add keyframe animation
const additionalStyles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .dashboard-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    .charts-grid {
      grid-template-columns: 1fr !important;
    }
    
    .summary-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);
}

export default Dashboard;

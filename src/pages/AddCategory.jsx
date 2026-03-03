import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const defaultCategories = ["Food", "Travel", "Bills", "Shopping", "Health"];

function AddCategory() {
  const [user, setUser] = useState(null);
  const [customCategories, setCustomCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const q = query(
          collection(db, "categories"),
          where("uid", "==", u.uid)
        );

        return onSnapshot(q, (snapshot) => {
          const cats = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }));
          setCustomCategories(cats);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !user) return;
    try {
      await addDoc(collection(db, "categories"), {
        uid: user.uid,
        name: newCategory.trim(),
      });
      setNewCategory("");
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Food: "🍱",
      Travel: "✈️",
      Bills: "📄",
      Shopping: "🛍️",
      Health: "🏥",
    };
    return icons[category] || "📋";
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Ambient Background Blobs */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.iconBadge}>🏷️</div>
          <h2 style={styles.heading}>Manage Categories</h2>
          <p style={styles.subtext}>Organize your spending with custom labels</p>
        </div>

        <div style={styles.gridContainer}>
          {/* Default Categories */}
          <div style={styles.glassCard}>
            <div style={styles.sectionHeader}>
              <span>⭐</span>
              <h3 style={styles.sectionTitle}>Default</h3>
            </div>
            <div style={styles.pillsGrid}>
              {defaultCategories.map((cat, index) => (
                <div key={index} style={styles.categoryPill}>
                  <span>{getCategoryIcon(cat)}</span>
                  <span>{cat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Categories */}
          <div style={styles.glassCard}>
            <div style={styles.sectionHeader}>
              <span>✨</span>
              <h3 style={styles.sectionTitle}>Custom</h3>
              <span style={styles.countBadge}>{customCategories.length}</span>
            </div>
            
            {customCategories.length === 0 ? (
              <div style={styles.emptyState}>No custom categories yet</div>
            ) : (
              <div style={styles.pillsGrid}>
                {customCategories.map((cat) => (
                  <div key={cat.id} style={styles.customPill}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span>📋</span>
                      <span>{cat.name}</span>
                    </div>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Input Section */}
        <div style={styles.inputCard}>
          <div style={styles.inputWrapper}>
            <input
              style={styles.input}
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Create new category..."
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <button
              style={newCategory.trim() ? styles.addBtn : styles.addBtnDisabled}
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#050505",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    paddingTop: "120px", // Pushes content below fixed Navbar
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
    background: "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)",
  },
  blob2: {
    position: "absolute",
    bottom: "10%",
    left: "-5%",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "0 20px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: "50px",
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
    fontSize: "2.2rem",
    fontWeight: "800",
    letterSpacing: "-1px",
    marginBottom: "8px",
  },
  subtext: {
    color: "#666",
    fontSize: "1rem",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "25px",
    marginBottom: "40px",
  },
  glassCard: {
    background: "rgba(255, 255, 255, 0.02)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "24px",
    padding: "30px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "25px",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  countBadge: {
    background: "rgba(255,255,255,0.1)",
    padding: "2px 10px",
    borderRadius: "100px",
    fontSize: "0.8rem",
    marginLeft: "auto",
  },
  pillsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  categoryPill: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "10px 18px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.95rem",
  },
  customPill: {
    background: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "10px 14px 10px 18px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    fontSize: "0.95rem",
    minWidth: "120px",
  },
  deleteBtn: {
    background: "rgba(255, 69, 58, 0.1)",
    border: "none",
    color: "#ff453a",
    borderRadius: "8px",
    width: "24px",
    height: "24px",
    cursor: "pointer",
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  emptyState: {
    color: "#444",
    textAlign: "center",
    padding: "20px",
    fontSize: "0.9rem",
    border: "1px dashed rgba(255,255,255,0.05)",
    borderRadius: "16px",
  },
  inputCard: {
    maxWidth: "500px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.02)",
    padding: "15px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  inputWrapper: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    background: "#0a0a0a",
    border: "1px solid #222",
    borderRadius: "12px",
    padding: "14px 18px",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
  },
  addBtn: {
    background: "#fff",
    color: "#000",
    border: "none",
    padding: "0 25px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  addBtnDisabled: {
    background: "#222",
    color: "#555",
    border: "none",
    padding: "0 25px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "not-allowed",
  },
};

export default AddCategory;
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
      Food: "🍽️",
      Travel: "✈️",
      Bills: "📄",
      Shopping: "🛍️",
      Health: "🏥",
    };
    return icons[category] || "📋";
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <span style={styles.icon}>🏷️</span>
          </div>
          <h2 style={styles.heading}>Manage Categories</h2>
          <p style={styles.subtitle}>
            Organize your transactions with custom categories
          </p>
        </div>

        <div style={styles.sectionsContainer}>
          <div style={styles.categorySection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>⭐</span>
              <h4 style={styles.sectionTitle}>Default Categories</h4>
            </div>
            <div style={styles.categoriesGrid}>
              {defaultCategories.map((cat, index) => (
                <div key={index} style={styles.defaultCategoryItem}>
                  <span style={styles.categoryEmoji}>
                    {getCategoryIcon(cat)}
                  </span>
                  <span style={styles.categoryName}>{cat}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.categorySection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>✨</span>
              <h4 style={styles.sectionTitle}>Your Custom Categories</h4>
              <span style={styles.badge}>{customCategories.length}</span>
            </div>
            {customCategories.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>📝</span>
                <p style={styles.emptyText}>No custom categories yet</p>
                <p style={styles.emptySubtext}>
                  Add your first category below!
                </p>
              </div>
            ) : (
              <div style={styles.categoriesGrid}>
                {customCategories.map((cat) => (
                  <div key={cat.id} style={styles.customCategoryItem}>
                    <div style={styles.customCategoryContent}>
                      <span style={styles.categoryEmoji}>📋</span>
                      <span style={styles.categoryName}>{cat.name}</span>
                    </div>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDeleteCategory(cat.id)}
                      onMouseEnter={(e) => {
                        e.target.style.background =
                          styles.deleteBtnHover.background;
                        e.target.style.transform =
                          styles.deleteBtnHover.transform;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = styles.deleteBtn.background;
                        e.target.style.transform = styles.deleteBtn.transform;
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={styles.addCategorySection}>
          <div style={styles.inputContainer}>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🏷️</span>
              <input
                style={styles.input}
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name..."
                onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
              />
            </div>
            <button
              style={styles.addButton}
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.background = styles.addButtonHover.background;
                  e.target.style.transform = styles.addButtonHover.transform;
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = newCategory.trim()
                  ? styles.addButton.background
                  : styles.addButtonDisabled.background;
                e.target.style.transform = styles.addButton.transform;
              }}
            >
              <span style={styles.buttonIcon}>➕</span>
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "2rem 1rem",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  container: {
    maxWidth: "800px",
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
    marginBottom: "2.5rem",
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
  sectionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    marginBottom: "2rem",
  },
  categorySection: {
    background: "rgba(255, 255, 255, 0.7)",
    borderRadius: "16px",
    padding: "1.5rem",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1.5rem",
  },
  sectionIcon: {
    fontSize: "1.25rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#374151",
    margin: 0,
    flex: 1,
  },
  badge: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  categoriesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },
  defaultCategoryItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
    borderRadius: "12px",
    border: "1px solid #c7d2fe",
    transition: "all 0.3s ease",
  },
  customCategoryItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem",
    background: "linear-gradient(135deg, #fef3c7, #fde68a)",
    borderRadius: "12px",
    border: "1px solid #fde68a",
    transition: "all 0.3s ease",
  },
  customCategoryContent: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  categoryEmoji: {
    fontSize: "1.5rem",
  },
  categoryName: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#374151",
  },
  deleteBtn: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: "8px",
    padding: "0.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "scale(1)",
  },
  deleteBtnHover: {
    background: "rgba(239, 68, 68, 0.2)",
    transform: "scale(1.1)",
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem 1rem",
    color: "#6b7280",
  },
  emptyIcon: {
    fontSize: "3rem",
    display: "block",
    marginBottom: "1rem",
  },
  emptyText: {
    fontSize: "1.1rem",
    fontWeight: "500",
    margin: "0 0 0.5rem 0",
    color: "#374151",
  },
  emptySubtext: {
    fontSize: "0.9rem",
    margin: 0,
  },
  addCategorySection: {
    background: "rgba(255, 255, 255, 0.7)",
    borderRadius: "16px",
    padding: "1.5rem",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  inputContainer: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-end",
  },
  inputWrapper: {
    flex: 1,
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1.25rem",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "16px 20px 16px 50px",
    fontSize: "1rem",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    background: "#ffffff",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  addButton: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    padding: "16px 24px",
    fontSize: "1rem",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontFamily: "inherit",
    boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
    transform: "scale(1)",
    whiteSpace: "nowrap",
  },
  addButtonHover: {
    background: "linear-gradient(135deg, #059669, #047857)",
    transform: "scale(1.05)",
  },
  addButtonDisabled: {
    background: "#9ca3af",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  buttonIcon: {
    fontSize: "1rem",
  },
};

// Add focus effects for input
const inputFocusStyle = `
  input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    transform: translateY(-1px);
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = inputFocusStyle;
  document.head.appendChild(styleSheet);
}

export default AddCategory;

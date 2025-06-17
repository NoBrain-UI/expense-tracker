import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Default user avatar
  const defaultAvatar =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";

  // Safely get user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setEmail(currentUser.email || "");

        // Load bio
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBio(docSnap.data().bio || "");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user || !user.uid) return alert("User not logged in.");

    try {
      await updateProfile(user, {
        displayName,
      });

      await setDoc(
        doc(db, "users", user.uid),
        { bio: bio || "" },
        { merge: true }
      );

      // Reload user data to reflect changes
      await auth.currentUser.reload();
      setUser(auth.currentUser);

      alert("✅ Profile updated!");
    } catch (error) {
      console.error("Profile update error:", error.message);
      alert("❌ Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!user || !user.email) return;

    if (!newPassword) return alert("Please enter a new password.");

    const currentPassword = prompt("Enter your current password to confirm:");
    if (!currentPassword) return;

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      setPasswordLoading(true);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setNewPassword("");
      alert("✅ Password changed!");
    } catch (error) {
      alert("❌ " + error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <span style={styles.icon}>👤</span>
          </div>
          <h2 style={styles.heading}>Profile Settings</h2>
          <p style={styles.subtitle}>Manage your account information</p>
        </div>

        <div style={styles.profileSection}>
          <div style={styles.profilePicContainer}>
            <div style={styles.profilePicWrapper}>
              <img
                src={defaultAvatar}
                alt="Default User Avatar"
                style={styles.profilePic}
              />
              <div style={styles.userBadge}>
                <span style={styles.userIcon}>👤</span>
              </div>
            </div>
            <div style={styles.userInfo}>
              <h3 style={styles.userName}>{displayName || "User"}</h3>
              <p style={styles.userEmail}>{email}</p>
            </div>
          </div>
        </div>

        <div style={styles.formsContainer}>
          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>📝</span>
              <h3 style={styles.cardTitle}>Personal Information</h3>
            </div>
            <form onSubmit={handleProfileUpdate} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={styles.input}
                  placeholder="Enter your full name"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  style={{ ...styles.input, ...styles.readOnlyInput }}
                />
                <span style={styles.helperText}>Email cannot be changed</span>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us something about yourself..."
                  style={styles.textarea}
                />
              </div>

              <button type="submit" style={styles.primaryButton}>
                <span style={styles.buttonIcon}>💾</span>
                Update Profile
              </button>
            </form>
          </div>

          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>🔒</span>
              <h3 style={styles.cardTitle}>Security Settings</h3>
            </div>
            <form onSubmit={handlePasswordChange} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Enter new password"
                />
                <span style={styles.helperText}>
                  Use a strong password with at least 8 characters
                </span>
              </div>
              <button
                type="submit"
                style={styles.secondaryButton}
                disabled={passwordLoading || !newPassword}
              >
                <span style={styles.buttonIcon}>🔑</span>
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>

        <div style={styles.dangerZone}>
          <div style={styles.dangerHeader}>
            <span style={styles.dangerIcon}>⚠️</span>
            <span style={styles.dangerTitle}>Danger Zone</span>
          </div>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseEnter={(e) => {
              e.target.style.background = styles.logoutButtonHover.background;
              e.target.style.transform = styles.logoutButtonHover.transform;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = styles.logoutButton.background;
              e.target.style.transform = styles.logoutButton.transform;
            }}
          >
            <span style={styles.buttonIcon}>🚪</span>
            Sign Out
          </button>
        </div>
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
    maxWidth: "800px",
    margin: "0 auto",
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
    color: "white",
    margin: "0 0 0.5rem 0",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "1rem",
    margin: 0,
  },
  profileSection: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    textAlign: "center",
  },
  profilePicContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
  },
  profilePicWrapper: {
    position: "relative",
    display: "inline-block",
  },
  profilePic: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid white",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease",
  },
  userBadge: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
  userIcon: {
    fontSize: "1.2rem",
    color: "white",
  },
  userInfo: {
    textAlign: "center",
  },
  userName: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#374151",
    margin: "0 0 0.5rem 0",
  },
  userEmail: {
    fontSize: "1rem",
    color: "#6b7280",
    margin: 0,
  },
  formsContainer: {
    display: "grid",
    gap: "2rem",
    gridTemplateColumns: "1fr",
  },
  formCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "2rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
  },
  cardIcon: {
    fontSize: "1.5rem",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#374151",
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
  readOnlyInput: {
    background: "#f9fafb",
    color: "#6b7280",
    cursor: "not-allowed",
  },
  textarea: {
    padding: "16px 20px",
    fontSize: "1rem",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    background: "#ffffff",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "inherit",
    minHeight: "100px",
    resize: "vertical",
  },
  helperText: {
    fontSize: "0.8rem",
    color: "#6b7280",
    marginTop: "0.25rem",
  },
  primaryButton: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
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
    justifyContent: "center",
    gap: "0.5rem",
    fontFamily: "inherit",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
  },
  secondaryButton: {
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
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
    justifyContent: "center",
    gap: "0.5rem",
    fontFamily: "inherit",
    boxShadow: "0 8px 24px rgba(245, 158, 11, 0.3)",
  },
  buttonIcon: {
    fontSize: "1rem",
  },
  dangerZone: {
    marginTop: "2rem",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "2rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  dangerHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid rgba(239, 68, 68, 0.2)",
  },
  dangerIcon: {
    fontSize: "1.5rem",
  },
  dangerTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#dc2626",
  },
  logoutButton: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
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
    justifyContent: "center",
    gap: "0.5rem",
    fontFamily: "inherit",
    boxShadow: "0 8px 24px rgba(239, 68, 68, 0.3)",
    transform: "scale(1)",
  },
  logoutButtonHover: {
    background: "linear-gradient(135deg, #dc2626, #b91c1c)",
    transform: "scale(1.02)",
  },
};

// Add focus effects and animations
const additionalStyles = `
  input:focus, textarea:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    transform: translateY(-1px);
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    .profile-pic {
      width: 120px !important;
      height: 120px !important;
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);
}

export default Profile;

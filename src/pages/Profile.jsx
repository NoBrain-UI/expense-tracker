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

  // Premium default avatar
  const defaultAvatar =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setEmail(currentUser.email || "");

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
      await updateProfile(user, { displayName });
      await setDoc(doc(db, "users", user.uid), { bio: bio || "" }, { merge: true });
      await auth.currentUser.reload();
      setUser(auth.currentUser);
      alert("✅ Profile updated!");
    } catch (error) {
      alert("❌ Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!user || !user.email || !newPassword) return;

    const currentPassword = prompt("Enter current password to confirm:");
    if (!currentPassword) return;

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

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
    <div style={styles.pageWrapper}>
      {/* Background Glows */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.iconBadge}>👤</div>
          <h2 style={styles.heading}>Account Settings</h2>
          <p style={styles.subtext}>Manage your identity and security</p>
        </header>

        {/* Profile Card */}
        <div style={styles.glassCard}>
          <div style={styles.profileInfoLayout}>
            <div style={styles.avatarWrapper}>
              <img src={defaultAvatar} alt="Avatar" style={styles.avatar} />
              <div style={styles.statusDot}></div>
            </div>
            <div style={{ textAlign: "left" }}>
              <h3 style={styles.profileName}>{displayName || "User Account"}</h3>
              <p style={styles.profileEmail}>{email}</p>
            </div>
          </div>
        </div>

        <div style={styles.grid}>
          {/* General Settings */}
          <div style={styles.glassCard}>
            <h3 style={styles.sectionTitle}>Personal Details</h3>
            <form onSubmit={handleProfileUpdate} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={styles.input}
                  placeholder="Your Name"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Biography</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={styles.textarea}
                  placeholder="A short bio..."
                />
              </div>
              <button type="submit" style={styles.primaryBtn}>Save Changes</button>
            </form>
          </div>

          {/* Security Settings */}
          <div style={styles.glassCard}>
            <h3 style={styles.sectionTitle}>Security</h3>
            <form onSubmit={handlePasswordChange} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Update Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                  placeholder="New password"
                />
              </div>
              <button
                type="submit"
                style={styles.secondaryBtn}
                disabled={passwordLoading || !newPassword}
              >
                {passwordLoading ? "Processing..." : "Update Password"}
              </button>
            </form>

            <div style={styles.divider}></div>
            
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Sign Out of Account
            </button>
          </div>
        </div>
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
    paddingBottom: "80px",
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
    marginBottom: "30px",
  },
  profileInfoLayout: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "24px",
    objectFit: "cover",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  statusDot: {
    position: "absolute",
    bottom: "-4px",
    right: "-4px",
    width: "16px",
    height: "16px",
    backgroundColor: "#00ffd5",
    borderRadius: "50%",
    border: "3px solid #050505",
  },
  profileName: {
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: "0 0 5px 0",
  },
  profileEmail: {
    fontSize: "0.95rem",
    color: "#555",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "25px",
  },
  sectionTitle: {
    fontSize: "0.8rem",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    color: "#444",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
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
  },
  textarea: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "14px",
    padding: "16px",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    minHeight: "100px",
    resize: "none",
  },
  primaryBtn: {
    background: "#fff",
    color: "#000",
    border: "none",
    padding: "16px",
    borderRadius: "14px",
    fontWeight: "800",
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "16px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.05)",
    margin: "30px 0",
  },
  logoutBtn: {
    background: "rgba(255, 69, 58, 0.1)",
    color: "#ff453a",
    border: "1px solid rgba(255, 69, 58, 0.2)",
    padding: "16px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
  },
};

export default Profile;
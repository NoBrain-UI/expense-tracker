import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <div style={styles.heroContainer}>
        <div style={styles.heroContent}>
          <div style={styles.heroBackground}></div>
          <h1 style={styles.heroHeading}>
            <span style={styles.gradient}>💰 FinanceEdge 💸</span>
          </h1>
          <p style={styles.heroSubheading}>
            Track your expenses smartly, effortlessly, and beautifully.
            <br />
            <span style={styles.accent}>
              Take control of your financial future today.
            </span>
          </p>
          <button
            style={styles.heroButton}
            onClick={() => navigate("/login")}
            onMouseOver={(e) =>
              (e.target.style.transform = "translateY(-2px) scale(1.05)")
            }
            onMouseOut={(e) =>
              (e.target.style.transform = "translateY(0) scale(1)")
            }
          >
            Get Started Free <span style={styles.buttonArrow}>→</span>
          </button>
        </div>
      </div>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.titleIcon}>🚀</span> Powerful Features
          </h2>
          <p style={styles.sectionSubtitle}>
            Everything you need to master your finances
          </p>
          <div style={styles.featuresGrid}>
            {/* Feature 1 */}
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📒</div>
              <h3 style={styles.featureTitle}>Smart Tracking</h3>
              <p style={styles.featureText}>
                Effortlessly log and categorize all your expenses with our
                intuitive interface.
              </p>
            </div>
            {/* Feature 2 */}
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🏷️</div>
              <h3 style={styles.featureTitle}>Auto Categories</h3>
              <p style={styles.featureText}>
                Intelligent categorization that learns from your spending
                patterns.
              </p>
            </div>
            {/* Feature 3 */}
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3 style={styles.featureTitle}>Visual Insights</h3>
              <p style={styles.featureText}>
                Beautiful charts and reports that make your data come alive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={styles.testimonialsSection}>
        <div style={styles.sectionContent}>
          <h2 style={styles.testimonialsTitle}>
            <span style={styles.titleIcon}>❤️</span> Loved by Thousands
          </h2>
          <p style={styles.sectionSubtitle}>See what our users are saying</p>
          <div style={styles.testimonialsGrid}>
            <div style={styles.testimonialCard}>
              <div style={styles.testimonialQuote}>"</div>
              <p style={styles.testimonialText}>
                “This app helped me save ₹5,000 in the first month! The insights
                are incredible.”
              </p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.authorAvatar}>A</div>
                <div>
                  <div style={styles.authorName}>Ayesha</div>
                  <div style={styles.authorTitle}>Student</div>
                </div>
              </div>
            </div>
            <div style={styles.testimonialCard}>
              <div style={styles.testimonialQuote}>"</div>
              <p style={styles.testimonialText}>
                “Finally understand where my money goes. The interface is so
                clean and intuitive!”
              </p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.authorAvatar}>R</div>
                <div>
                  <div style={styles.authorName}>Raj</div>
                  <div style={styles.authorTitle}>Developer</div>
                </div>
              </div>
            </div>
            <div style={styles.testimonialCard}>
              <div style={styles.testimonialQuote}>"</div>
              <p style={styles.testimonialText}>
                “Powerful features with a beautiful design. This is exactly what
                I needed!”
              </p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.authorAvatar}>P</div>
                <div>
                  <div style={styles.authorName}>Priya</div>
                  <div style={styles.authorTitle}>Freelancer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to transform your finances? 💪</h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of users who've taken control of their money
          </p>
          <button
            style={styles.ctaButton}
            onClick={() => navigate("/signup")}
            onMouseOver={(e) =>
              (e.target.style.transform = "translateY(-3px) scale(1.05)")
            }
            onMouseOut={(e) =>
              (e.target.style.transform = "translateY(0) scale(1)")
            }
          >
            Start Your Journey <span style={styles.buttonArrow}>→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            © {new Date().getFullYear()} FinanceEdge | Crafted with ❤️ in India
          </p>
        </div>
      </footer>
    </>
  );
};

const styles = {
  heroContainer: {
    backgroundColor: "#1A1A2E",
    padding: "6rem 2rem",
    textAlign: "center",
    color: "white",
    position: "relative",
  },
  heroContent: {
    maxWidth: "700px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  heroHeading: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  gradient: {
    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubheading: {
    fontSize: "1.2rem",
    lineHeight: "1.5",
    marginBottom: "1.5rem",
  },
  accent: {
    color: "#00ffd5",
  },
  heroButton: {
    backgroundColor: "#00c6ff",
    color: "white",
    border: "none",
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  buttonArrow: {
    marginLeft: "0.5rem",
  },
  featuresSection: {
    backgroundColor: "#f8f9fa",
    padding: "5rem 2rem",
  },
  sectionContent: {
    maxWidth: "1000px",
    margin: "0 auto",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  titleIcon: {
    marginRight: "0.5rem",
  },
  sectionSubtitle: {
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "2rem",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
  },
  featureCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
  },
  featureIcon: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  featureTitle: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  featureText: {
    color: "#666",
  },
  testimonialsSection: {
    backgroundColor: "#f0f4f8",
    padding: "5rem 2rem",
  },
  testimonialsTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  testimonialsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    marginTop: "2rem",
  },
  testimonialCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    position: "relative",
  },
  testimonialQuote: {
    fontSize: "2rem",
    color: "#0072ff",
    position: "absolute",
    top: "1rem",
    left: "1rem",
  },
  testimonialText: {
    fontSize: "1rem",
    lineHeight: "1.6",
    marginBottom: "1rem",
  },
  testimonialAuthor: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
  },
  authorAvatar: {
    backgroundColor: "#0072ff",
    color: "white",
    borderRadius: "50%",
    padding: "0.6rem 0.9rem",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  authorName: {
    fontWeight: "bold",
  },
  authorTitle: {
    fontSize: "0.85rem",
    color: "#777",
  },
  ctaSection: {
    backgroundColor: "#1a1a2e",
    color: "white",
    textAlign: "center",
    padding: "4rem 2rem",
  },
  ctaContent: {
    maxWidth: "700px",
    margin: "0 auto",
  },
  ctaTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  ctaSubtitle: {
    fontSize: "1.1rem",
    marginBottom: "2rem",
  },
  ctaButton: {
    backgroundColor: "#00ffd5",
    color: "#1a1a2e",
    border: "none",
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  footer: {
    backgroundColor: "#0f0f1a",
    padding: "2rem",
    textAlign: "center",
    color: "white",
  },
  footerText: {
    fontSize: "0.9rem",
  },
};

export default Home;
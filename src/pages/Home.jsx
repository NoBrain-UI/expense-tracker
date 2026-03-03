import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>
      <div style={styles.blob3}></div>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navLogo}>FinanceEdge<span style={{color: '#00ffd5'}}>.</span></div>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#testimonials" style={styles.navLink}>Reviews</a>
          <button style={styles.navBtn} onClick={() => navigate("/login")}>Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.heroContainer}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>✨ VERSION 3.0 IS LIVE</div>
          <h1 style={styles.heroHeading}>
            Take the stress out of <br />
            <span style={styles.gradientText}>Financial Freedom.</span>
          </h1>
          <p style={styles.heroSubheading}>
            Stop manual logging. Start automated wealth building. 
            The only tool you need to track every rupee across accounts.
          </p>
          <div style={styles.buttonGroup}>
            <button style={styles.primaryButton} onClick={() => navigate("/signup")}>
              Get Started Free
            </button>
            <button style={styles.secondaryButton}>View Demo</button>
          </div>
          
          <div style={styles.heroStats}>
            <div style={styles.statItem}><b>50k+</b><span>Downloads</span></div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}><b>₹10Cr+</b><span>Monthly Volume</span></div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}><b>4.9/5</b><span>User Rating</span></div>
          </div>
        </div>
      </section>

      {/* Expanded Features Section */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Everything you need.</h2>
          <p style={styles.sectionSubtitle}>Powerful features to help you master your cash flow.</p>
        </div>
        <div style={styles.featuresGrid}>
          <FeatureCard icon="📊" title="Visual Analytics" desc="Deep-dive into spending habits with interactive 3D charts." />
          <FeatureCard icon="🏦" title="Multi-Bank Sync" desc="Connect all your savings and credit accounts in one dashboard." />
          <FeatureCard icon="📅" title="Bill Reminders" desc="Never pay a late fee again with intelligent auto-notifications." />
          <FeatureCard icon="🎯" title="Goal Tracking" desc="Set savings goals for cars, homes, or trips and watch the progress." />
        </div>
      </section>

      {/* Testimonials Bento Grid */}
      <section id="testimonials" style={styles.testimonialSection}>
        <h2 style={styles.sectionTitleCenter}>Trusted by the best.</h2>
        <div style={styles.bentoGrid}>
          <div style={{...styles.glassCard, gridArea: 'a'}}>
            <p style={styles.quote}>"The AI categorization is a game changer. It correctly tagged my niche hobby expenses without me doing a thing. Saved me 2 hours a week."</p>
            <div style={styles.author}>— Ananya K., <small>Product Designer</small></div>
          </div>
          <div style={{...styles.glassCard, gridArea: 'b', background: 'linear-gradient(135deg, rgba(0, 198, 255, 0.1), transparent)'}}>
            <p style={styles.quote}>"Cleanest UI ever. Period."</p>
            <div style={styles.author}>— Rohan S., <small>Full Stack Dev</small></div>
          </div>
          <div style={{...styles.glassCard, gridArea: 'c'}}>
            <p style={styles.quote}>"Finally understand where my freelance income goes. Simple and powerful."</p>
            <div style={styles.author}>— Karan V., <small>Freelancer</small></div>
          </div>
          <div style={{...styles.glassCard, gridArea: 'd'}}>
            <p style={styles.quote}>"The bill reminders saved me from a ₹2,000 credit card penalty last month. Worth every penny."</p>
            <div style={styles.author}>— Sneha M., <small>Marketing Head</small></div>
          </div>
        </div>
      </section>

      {/* Pre-Footer CTA (Fills the gap) */}
      <section style={styles.ctaBanner}>
        <h2 style={{fontSize: '2.5rem', marginBottom: '20px'}}>Ready to level up?</h2>
        <p style={{marginBottom: '30px', color: '#aaa'}}>Join 50,000+ others taking control of their future.</p>
        <button style={styles.primaryButton}>Join Now</button>
      </section>

      {/* Fat Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerGrid}>
          <div style={styles.footerBrandCol}>
            <h3 style={{marginBottom: '15px'}}>FinanceEdge.</h3>
            <p style={{color: '#666', fontSize: '0.9rem', lineHeight: '1.6'}}>
              Building the next generation of financial tools for India's digital youth. 
              Safe, secure, and stunningly simple.
            </p>
          </div>
          
          <div style={styles.footerLinksCol}>
            <h4 style={styles.footerHead}>Product</h4>
            <ul style={styles.footerList}>
              <li>Features</li>
              <li>Security</li>
              <li>Pricing</li>
            </ul>
          </div>

          <div style={styles.contactFormCard}>
            <h4 style={{marginBottom: '15px'}}>Contact Us ✉️</h4>
            <input type="email" placeholder="Your Email" style={styles.input} />
            <textarea placeholder="Message" style={styles.textarea}></textarea>
            <button style={styles.sendBtn}>Send</button>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© {new Date().getFullYear()} FinanceEdge Inc. Crafted with 🖤 in India.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div style={styles.glassCardFeature}>
    <div style={styles.featureIcon}>{icon}</div>
    <h3 style={styles.featureTitle}>{title}</h3>
    <p style={styles.featureText}>{desc}</p>
  </div>
);

const styles = {
  pageWrapper: { backgroundColor: "#020202", color: "#fff", fontFamily: "'Inter', sans-serif", minHeight: "100vh", position: "relative", overflowX: "hidden" },
  blob1: { position: "absolute", top: "-5%", right: "-5%", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(0, 198, 255, 0.1) 0%, transparent 70%)", zIndex: 0 },
  blob2: { position: "absolute", bottom: "10%", left: "-5%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(0, 255, 213, 0.08) 0%, transparent 70%)", zIndex: 0 },
  blob3: { position: "absolute", top: "40%", left: "20%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(123, 31, 162, 0.05) 0%, transparent 70%)", zIndex: 0 },

  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 8%", position: "fixed", width: "100%", top: 0, backdropFilter: "blur(20px)", zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.05)", boxSizing: 'border-box' },
  navLogo: { fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "-1px" },
  navLinks: { display: "flex", gap: "30px", alignItems: "center" },
  navLink: { color: "#888", textDecoration: "none", fontSize: "0.9rem", cursor: 'pointer' },
  navBtn: { background: "#fff", color: "#000", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },

  heroContainer: { padding: "220px 20px 120px", textAlign: "center", position: "relative", zIndex: 1 },
  badge: { display: "inline-block", padding: "6px 16px", borderRadius: "100px", background: "rgba(0, 255, 213, 0.1)", color: "#00ffd5", fontSize: "0.8rem", fontWeight: "700", marginBottom: "25px", border: "1px solid rgba(0, 255, 213, 0.2)" },
  heroHeading: { fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: "900", lineHeight: "1", letterSpacing: "-4px", marginBottom: "35px" },
  gradientText: { background: "linear-gradient(to right, #00c6ff, #00ffd5, #7b1fa2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSubheading: { fontSize: "1.3rem", color: "#888", maxWidth: "700px", margin: "0 auto 50px" },
  buttonGroup: { display: "flex", gap: "20px", justifyContent: "center", marginBottom: "80px" },
  primaryButton: { padding: "20px 40px", fontSize: "1.1rem", fontWeight: "700", borderRadius: "16px", border: "none", background: "#fff", color: "#000", cursor: "pointer", transition: '0.3s' },
  secondaryButton: { padding: "20px 40px", fontSize: "1.1rem", fontWeight: "700", borderRadius: "16px", border: "1px solid #333", background: "transparent", color: "#fff", cursor: "pointer" },
  
  heroStats: { display: "flex", justifyContent: "center", gap: "50px", color: "#555" },
  statItem: { display: "flex", flexDirection: "column", textAlign: "left" },
  statDivider: { height: "40px", width: "1px", background: "#222" },

  featuresSection: { padding: "120px 8%", zIndex: 1, position: 'relative' },
  sectionHeader: { marginBottom: "80px", textAlign: 'center' },
  sectionTitle: { fontSize: "3.5rem", fontWeight: "900", marginBottom: '15px' },
  sectionTitleCenter: { fontSize: "3.5rem", fontWeight: "900", textAlign: "center", marginBottom: "60px" },
  sectionSubtitle: { color: "#666", fontSize: "1.2rem" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px" },

  testimonialSection: { padding: "120px 8%" },
  bentoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateAreas: '"a b" "a c" "d c"', gap: "20px", maxWidth: "1000px", margin: "0 auto" },
  glassCard: { background: "rgba(255, 255, 255, 0.02)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "40px", borderRadius: "32px" },
  glassCardFeature: { background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.05)", padding: "40px", borderRadius: "24px" },
  quote: { fontSize: "1.2rem", lineHeight: "1.7", color: "#ccc", marginBottom: "25px" },
  author: { fontWeight: "bold", color: "#00ffd5" },
  
  featureIcon: { fontSize: "2.5rem", marginBottom: "20px" },
  featureTitle: { fontSize: "1.5rem", fontWeight: "800", marginBottom: "12px" },
  featureText: { color: "#777", lineHeight: "1.6" },

  ctaBanner: { padding: "100px 20px", textAlign: 'center', background: 'radial-gradient(circle at center, #0a0a0a 0%, #000 100%)', borderY: '1px solid #111' },

  footer: { padding: "100px 8% 40px", borderTop: "1px solid #111", background: "#010101" },
  footerGrid: { display: "grid", gridTemplateColumns: "2fr 1fr 2fr", gap: "80px", marginBottom: "80px" },
  footerHead: { fontSize: '1.1rem', marginBottom: '20px', color: '#fff' },
  footerList: { listStyle: 'none', padding: 0, color: '#666', lineHeight: '2.5', fontSize: '0.9rem' },
  contactFormCard: { background: "#0a0a0a", padding: "35px", borderRadius: "24px", border: "1px solid #1a1a1a" },
  input: { width: "100%", padding: "14px", background: "#111", border: "1px solid #222", borderRadius: "10px", color: "#fff", marginBottom: "15px", outline: "none", boxSizing: 'border-box' },
  textarea: { width: "100%", padding: "14px", background: "#111", border: "1px solid #222", borderRadius: "10px", color: "#fff", marginBottom: "15px", height: "100px", resize: "none", outline: "none", boxSizing: 'border-box' },
  sendBtn: { width: "100%", padding: "14px", background: "linear-gradient(to right, #00c6ff, #0072ff)", border: "none", borderRadius: "10px", color: "#fff", fontWeight: "700", cursor: "pointer" },
  footerBottom: { textAlign: "center", color: "#444", fontSize: "0.85rem", borderTop: '1px solid #111', paddingTop: '40px' }
};

export default Home;
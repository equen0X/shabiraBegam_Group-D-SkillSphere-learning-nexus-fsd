import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../components/Background";
import "../styles/learningPage.css"; // Reuse learning page styles for identical measurements

export default function ContactPage() {
  const navigate = useNavigate();

  const contactChannels = [
    {
      key: "react",
      icon: "✉️",
      category: "EMAIL TICKETING",
      title: "support@skillsphere.com",
      ledBy: "Operations Helpdesk",
      badgeReward: "Response Time: < 2 Hours",
      bullets: [
        "24/7 client ticketing service",
        "Technical bug and query resolution",
        "General registration guidance"
      ]
    },
    {
      key: "java",
      icon: "📞",
      category: "TELEPHONY GATEWAY",
      title: "+91 98765 43210",
      ledBy: "Live Call Representatives",
      badgeReward: "Availability: Mon-Sat",
      bullets: [
        "Voice call assistance",
        "Priority corporate routing help",
        "Setup walkthrough explanations"
      ]
    }
  ];

  return (
    <div className="learning-portal-page">
      <Background />
      <Navbar />

      <main className="learning-portal-content">
        
        {/* Header Title Section matching /learning exactly */}
        <section className="lp-header-section guest-hero">
          <div className="lp-badge" style={{
            display: 'inline-block',
            background: 'rgba(0, 229, 255, 0.08)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            color: '#00e5ff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontFamily: 'Orbitron, sans-serif',
            marginBottom: '15px'
          }}>
            📞 Live Support
          </div>
          <h1 style={{ marginBottom: '15px' }}>Get In Touch With Us</h1>
          <p>Have questions about course tracks, sandbox compilers, or team directories? Our helpdesk is available 24/7 to assist you.</p>
        </section>

        {/* Grid of Contact Channels with exact same measurements */}
        <div className="guest-courses-grid">
          {contactChannels.map((feat, idx) => (
            <div key={idx} className={`guest-course-card ${feat.key}`}>
              <div className="guest-card-header">
                <span className="guest-course-icon">{feat.icon}</span>
                <span className="guest-chapters-count">{feat.category}</span>
              </div>
              
              <h3>{feat.title}</h3>
              <p className="guest-instructor">Led by <strong>{feat.ledBy}</strong></p>
              
              <div className="guest-badge-preview">
                <span>🏆 Availability Metric:</span> <strong>{feat.badgeReward}</strong>
              </div>

              <div className="guest-syllabus-box">
                <h4>Channel Overview</h4>
                <ul>
                  {feat.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              </div>

              <button 
                className="guest-unlock-btn"
                onClick={() => alert("Please register or login first to contact our live support representatives via ticket creation!")}
              >
                Contact Now
              </button>
            </div>
          ))}
        </div>

        {/* Locked Callout Banner matching /learning exactly */}
        <section className="guest-locked-callout">
          <div className="lock-icon">🔒</div>
          <h2>Submit a Technical Live Ticket</h2>
          <p>
            Please register a free Student account or log into your Corporate Dashboard to open live chat tickets with our engineers and administrators.
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="guest-unlock-btn react" 
            style={{ maxWidth: '280px', margin: '30px auto 0 auto', display: 'block' }}
          >
            Login to Continue
          </button>
        </section>

      </main>

      <Footer />
    </div>
  );
}
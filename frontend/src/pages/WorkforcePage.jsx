import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../components/Background";
import "../styles/learningPage.css"; // Reuse learning page styles for identical measurements

export default function WorkforcePage() {
  const navigate = useNavigate();

  const workforceCapabilities = [
    {
      key: "react",
      icon: "👥",
      category: "EMPLOYEE REGISTRY",
      title: "Team Resource Directory",
      ledBy: "Operations Managers",
      badgeReward: "Live Headcount Metrics",
      bullets: [
        "Dynamic employee database management",
        "Add and remove profiles in real-time",
        "Individual performance score tracking"
      ]
    },
    {
      key: "java",
      icon: "📋",
      category: "APPROVAL WORKFLOWS",
      title: "Casual & Annual Leaves",
      ledBy: "Real-Time Review Queue",
      badgeReward: "System Audit Activity logs",
      bullets: [
        "Interactive approve and reject buttons",
        "Instant counter notifications for pending leave",
        "Detailed applicant reason logging"
      ]
    },
    {
      key: "springboot",
      icon: "🎯",
      category: "PROJECT MANAGEMENT",
      title: "Sprint Project Planner",
      ledBy: "Agile Task Assigner",
      badgeReward: "Velocity Capacity Tracker",
      bullets: [
        "Priority status tags (High/Med/Low)",
        "Sprint velocity percentage meters",
        "Individual workload indicators"
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
            background: 'rgba(255, 0, 200, 0.08)',
            border: '1px solid rgba(255, 0, 200, 0.2)',
            color: '#ff00c8',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontFamily: 'Orbitron, sans-serif',
            marginBottom: '15px'
          }}>
            💼 ENTERPRISE HUB
          </div>
          <h1 style={{ marginBottom: '15px' }}>Explore Workforce Management</h1>
          <p>Simplify team operations, review active leave applications, coordinate sprints, and monitor real-time company upskilling analytics.</p>
        </section>

        {/* Grid of Workforce Capabilities with exact same measurements */}
        <div className="guest-courses-grid">
          {workforceCapabilities.map((feat, idx) => (
            <div key={idx} className={`guest-course-card ${feat.key}`}>
              <div className="guest-card-header">
                <span className="guest-course-icon">{feat.icon}</span>
                <span className="guest-chapters-count">{feat.category}</span>
              </div>
              
              <h3>{feat.title}</h3>
              <p className="guest-instructor">Led by <strong>{feat.ledBy}</strong></p>
              
              <div className="guest-badge-preview">
                <span>🏆 Associated Indicator:</span> <strong>{feat.badgeReward}</strong>
              </div>

              <div className="guest-syllabus-box">
                <h4>Capability Overview</h4>
                <ul>
                  {feat.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              </div>

              <button 
                className="guest-unlock-btn"
                onClick={() => navigate('/register', { state: { role: 'EMPLOYEE', step: 2 } })}
              >
                Start Managing
              </button>
            </div>
          ))}
        </div>

        {/* Locked Callout Banner matching /learning exactly */}
        <section className="guest-locked-callout">
          <div className="lock-icon">🔒</div>
          <h2>Unlock Full Corporate Workforce Suite</h2>
          <p>
            Register a free Workforce employee account or log in with your credentials to manage active sprints, review employee leave balances, deploy docker containers, and access smart analytics.
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
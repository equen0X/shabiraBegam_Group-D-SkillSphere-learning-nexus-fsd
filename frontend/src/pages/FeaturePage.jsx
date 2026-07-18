import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../components/Background";
import "../styles/learningPage.css"; // Reuse learning page styles for identical measurements

export default function FeaturePage() {
  const navigate = useNavigate();

  const featuresList = [
    {
      key: "react",
      icon: "💻",
      category: "STUDENT WORKSPACE",
      title: "Interactive Code Sandbox",
      ledBy: "Multi-Language Compiler",
      badgeReward: "Code Ninja Achievement",
      bullets: [
        "Inline and standalone sandbox views",
        "Compiles Python, C++, C, and Java",
        "State-of-the-art monospace shell output"
      ]
    },
    {
      key: "java",
      icon: "🧠",
      category: "COGNITIVE MENTOR",
      title: "SphereAI Assistant",
      ledBy: "Multi-Turn Knowledge Bot",
      badgeReward: "AI Conversationalist Badge",
      bullets: [
        "Unrestricted, fully informative answers",
        "Direct CORS-safe API connection",
        "Custom platform fallback guidance"
      ]
    },
    {
      key: "springboot",
      icon: "🎓",
      category: "STUDENT STUDY HUB",
      title: "Interactive Study Modules",
      ledBy: "Guided Syllabus Curriculum",
      badgeReward: "React & Java Master Badges",
      bullets: [
        "Granular reading completion tracks",
        "Interactive checkboxes and logs",
        "Real-time level progression matrix"
      ]
    },
    {
      key: "react",
      icon: "⚡",
      category: "GAMIFICATION ENGINE",
      title: "Level Status Matrix",
      ledBy: "Automatic Progression",
      badgeReward: "Fast Learner Badge",
      bullets: [
        "Advancement from Level 0 to Level 1",
        "Streak triggers and daily logins",
        "11 unique achievement badges"
      ]
    },
    {
      key: "java",
      icon: "👥",
      category: "WORKFORCE MANAGEMENT",
      title: "Operations Team Directory",
      ledBy: "Resource Allocation Tool",
      badgeReward: "Performance Index Score",
      bullets: [
        "Dynamic employee database management",
        "Casual/annual leave approvals review",
        "Headcount metrics KPI counters"
      ]
    },
    {
      key: "springboot",
      icon: "🎯",
      category: "WORKFORCE PLANNING",
      title: "Sprint Project Planner",
      ledBy: "Agile Task Assigner",
      badgeReward: "Velocity Capacity Tracker",
      bullets: [
        "Priority status tags (High/Med/Low)",
        "Sprint velocity indicators",
        "Interactive project logs"
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
            🚀 PLATFORM CAPABILITIES
          </div>
          <h1 style={{ marginBottom: '15px' }}>Explore Professional Features</h1>
          <p>SkillSphere combines intelligent study paths, multi-language sandbox compiling, operations management, and AI guidance into one futuristic platform.</p>
        </section>

        {/* Grid of Features with exact same measurements */}
        <div className="guest-courses-grid">
          {featuresList.map((feat, idx) => (
            <div key={idx} className={`guest-course-card ${feat.key}`}>
              <div className="guest-card-header">
                <span className="guest-course-icon">{feat.icon}</span>
                <span className="guest-chapters-count">{feat.category}</span>
              </div>
              
              <h3>{feat.title}</h3>
              <p className="guest-instructor">Led by <strong>{feat.ledBy}</strong></p>
              
              <div className="guest-badge-preview">
                <span>🏆 Associated Badge:</span> <strong>{feat.badgeReward}</strong>
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
                onClick={() => navigate('/register')}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Locked Callout Banner matching /learning exactly */}
        <section className="guest-locked-callout">
          <div className="lock-icon">🔒</div>
          <h2>Unlock All Premium Platform Features</h2>
          <p>
            Register a free Student account or log into your Workforce Dashboard to access interactive code compilers, real-time analytics, daily study achievements, and AI assistants.
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
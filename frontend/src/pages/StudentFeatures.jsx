import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../components/Background";
import "../styles/studentFeatures.css";

export default function StudentFeatures() {
  const navigate = useNavigate();

  const badgesList = [
    { name: "🔥 Daily Streak", desc: "Logged in 5 days straight to build momentum", icon: "🔥" },
    { name: "⚛️ React Master", desc: "Scored 85%+ on the final React Quiz Challenge", icon: "⚛️" },
    { name: "☕ Java Master", desc: "Scored 85%+ on the final Java OOPs Quiz Challenge", icon: "☕" },
    { name: "🍃 Spring Boot Master", desc: "Scored 85%+ on the final Spring Boot Quiz Challenge", icon: "🍃" },
    { name: "🚀 Fast Learner", desc: "Successfully completed any study track in under 3 days", icon: "🚀" },
    { name: "🏆 Top Performer", desc: "Secured a top 5 rank on the global XP leaderboard", icon: "🏆" },
    { name: "💻 Code Ninja", desc: "Logged over 10 hours of active code study within modules", icon: "💻" },
    { name: "🧠 AI Conversationalist", desc: "Asked SphereAI 10+ questions for study support", icon: "🧠" },
    { name: "🛡️ Security Specialist", desc: "Successfully finished the Spring Boot security segment", icon: "🛡️" },
    { name: "💎 Elite Coder", desc: "Reached Level 10 or higher in course tracks", icon: "💎" },
    { name: "🌟 Perfect Quizzer", desc: "Scored 100% on any final track assessment", icon: "🌟" }
  ];

  const features = [
    {
      icon: "🎓",
      title: "Interactive Study Hub",
      desc: "Practice core development skills through guided modules in React, Spring Boot, Cybersecurity, and Machine Learning.",
      bullets: [
        "Interactive study actions",
        "Visual completion status indicators",
        "Granular progress logs"
      ]
    },
    {
      icon: "⚡",
      title: "Gamification & XP Matrix",
      desc: "Earn XP points by completing study blocks, passing checkpoints, and logging in daily to maintain active learning streaks.",
      bullets: [
        "Streaks track learning activity",
        "Level progression multipliers",
        "Unlock badges as you learn"
      ]
    },
    {
      icon: "🏆",
      title: "Live Leaderboards",
      desc: "Compete with other learners in real-time. Standings re-sort instantly when anyone earns XP points.",
      bullets: [
        "Live score sorting standings",
        "Highlighted active user positions",
        "Top-3 podium achievements"
      ]
    },
    {
      icon: "📜",
      title: "Blockchain Certifications",
      desc: "Secure, cryptographically signed certifications generated automatically upon completing any course track.",
      bullets: [
        "Unique certificate hash keys",
        "Fast copy-validation controls",
        "Resume-ready integrations"
      ]
    },
    {
      icon: "🤖",
      title: "SphereAI Mentor Chatbot",
      desc: "An intelligent query console available on every page to answer general questions, recommend paths, or explain topics.",
      bullets: [
        "Multi-turn conversation history",
        "CORS-safe GET endpoint requests",
        "Topic recommendation chips"
      ]
    }
  ];

  return (
    <div className="sf-features-page">
      <Background />
      <Navbar />

      <main className="sf-features-content">
        
        {/* Page Header */}
        <section className="sf-features-header">
          <h1>Student Features Portal</h1>
          <p>Explore the tools designed to gamify your learning, verify your accomplishments on the blockchain, and help you master technical skills.</p>
        </section>

        {/* Feature Grid */}
        <div className="sf-features-grid">
          {features.map((feat, i) => (
            <div key={i} className="sf-feature-card">
              <span className="sf-feature-icon">{feat.icon}</span>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
              <ul className="sf-feature-bullets">
                {feat.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Badge Progression Sequence Section */}
        <section className="sf-badge-sequence-section" style={{
          marginTop: '60px',
          background: 'rgba(18, 18, 30, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
          padding: '40px 30px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '28px',
            textAlign: 'center',
            marginBottom: '10px',
            background: 'linear-gradient(90deg, #00e5ff, #8a2eff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Badge Achievement Sequence
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '16px',
            textAlign: 'center',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px auto'
          }}>
            Earn and unlock these cyber-badges sequentially as you progress through study milestones, daily quests, and final track assessments.
          </p>

          <div className="badge-sequence-timeline" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative',
            paddingLeft: '15px'
          }}>
            {/* Timeline stem vertical connector */}
            <div style={{
              position: 'absolute',
              left: '34px',
              top: '20px',
              bottom: '20px',
              width: '2px',
              background: 'linear-gradient(180deg, #00e5ff 0%, #8a2eff 50%, #ff00c8 100%)',
              boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)',
              zIndex: 1
            }} />

            {badgesList.map((badge, idx) => (
              <div 
                key={idx} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  background: 'rgba(18, 18, 28, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(0, 229, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '24px',
                  position: 'relative',
                  zIndex: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.4)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 229, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateX(8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.1)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{
                  background: 'rgba(0, 229, 255, 0.12)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  color: '#00e5ff',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Orbitron',
                  fontWeight: '800',
                  fontSize: '14px',
                  flexShrink: 0,
                  boxShadow: '0 0 10px rgba(0, 229, 255, 0.1)'
                }}>
                  {idx + 1}
                </div>
                <span style={{ fontSize: '32px', flexShrink: 0 }}>{badge.icon}</span>
                <div>
                  <h4 style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '18px',
                    color: '#ffffff',
                    margin: '0 0 4px 0'
                  }}>{badge.name}</h4>
                  <p style={{
                    color: '#94a3b8',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '15px',
                    fontWeight: '500',
                    margin: 0
                  }}>{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="sf-features-cta">
          <h4>Ready to resume your study path?</h4>
          <p>Navigate straight back to your workspace console to log new XP points and check your active quest list.</p>
          <button className="sf-cta-btn" onClick={() => navigate('/student-home')}>
            Go to Student Home
          </button>
        </section>

      </main>

      <Footer />
    </div>
  );
}

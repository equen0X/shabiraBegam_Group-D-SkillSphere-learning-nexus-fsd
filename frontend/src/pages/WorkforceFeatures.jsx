import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../components/Background";
import "../styles/workforceFeatures.css";

export default function WorkforceFeatures() {
  const { workforceTheme } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-wf-theme", workforceTheme || "dark");
    return () => {
      document.documentElement.removeAttribute("data-wf-theme");
    };
  }, [workforceTheme]);

  const features = [
    {
      icon: "👥",
      title: "Team Resource Directory",
      desc: "An operations registry detailing member names, departments, active statuses, and performance logs in a single panel.",
      bullets: [
        "Add new mock employees dynamically",
        "Delete or modify profiles",
        "Performance score tracking"
      ]
    },
    {
      icon: "🎯",
      title: "Sprint Project Planner",
      desc: "Assign projects to specific members, set initial priority tags, and track completion progress dynamically.",
      bullets: [
        "Create custom project assignments",
        "Dynamic priority indicators (High/Med/Low)",
        "Progress tracking bar integration"
      ]
    },
    {
      icon: "✈️",
      title: "Automated Leave Approval",
      desc: "A dedicated review queue where managers can approve or reject casual/annual leaves in real-time, preventing project overlap.",
      bullets: [
        "Real-time pending request counters",
        "Approve & Reject click actions",
        "Contextual descriptions for applications"
      ]
    },
    {
      icon: "📈",
      title: "Operations Metrics Analytics",
      desc: "Futuristic analytics overview grids displaying overall headcount, active projects, team averages, and warning flags.",
      bullets: [
        "Aggregated workforce metrics",
        "Interactive KPI overview panels",
        "Glassmorphic design layouts"
      ]
    },
    {
      icon: "🤖",
      title: "SphereHR Analytics Assistant",
      desc: "An intelligent query console backed by live AI completions to help answer questions about team optimization and performance.",
      bullets: [
        "Multi-turn conversation history",
        "CORS-safe GET endpoint requests",
        "Resource planning analytics advice"
      ]
    },
    {
      icon: "⚙️",
      title: "Upskilling & Training Paths",
      desc: "Assign training paths and monitor completion states of employee upskilling programs in containerization, security, and rendering.",
      bullets: [
        "Enrolled engineer counts",
        "Dynamic curriculum progress tracking",
        "Multi-track container and JWT security meters"
      ]
    },
    {
      icon: "📋",
      title: "Live Audit System Logs",
      desc: "A complete logging framework to track operations, git commits, schema updates, pipeline builds, and staging promotions in real-time.",
      bullets: [
        "Real-time event logging audit",
        "Timestamped system updates",
        "Pipeline staging build promotions"
      ]
    }
  ];

  return (
    <div className="wf-features-page">
      <Background />
      <Navbar />

      <main className="wf-features-content">
        
        {/* Page Header */}
        <section className="wf-features-header">
          <h1>Workforce Management Features</h1>
          <p>Explore the operational widgets, employee performance meters, project tracking lists, and AI assistants built for operations management.</p>
        </section>

        {/* Feature Grid */}
        <div className="wf-features-grid">
          {features.map((feat, i) => (
            <div key={i} className="wf-feature-card">
              <span className="wf-feature-icon">{feat.icon}</span>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
              <ul className="wf-feature-bullets">
                {feat.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <section className="wf-features-cta">
          <h4>Ready to resume operations management?</h4>
          <p>Navigate back to your management dashboard workspace to update employee profiles or assign new projects.</p>
          <button className="wf-cta-btn" onClick={() => navigate('/workforce-home')}>
            Go to Workforce Home
          </button>
        </section>

      </main>

      <Footer />
    </div>
  );
}

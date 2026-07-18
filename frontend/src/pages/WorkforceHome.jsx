import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/workforceHome.css";

export default function WorkforceHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock initial queue of alerts/leaves
  const [leaveQueue, setLeaveQueue] = useState([
    { id: 1, name: "Jane Doe", type: "Annual Leave", desc: "Coincides with sprint deadlines", status: "PENDING" },
    { id: 2, name: "Mark Smith", type: "Sick Leave", desc: "Medical checkup validation", status: "PENDING" }
  ]);

  const handleProcessLeave = (id, newStatus) => {
    setLeaveQueue(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  // Mock live operations updates log
  const [logs, setLogs] = useState([
    { id: 1, text: "Sarah Jenkins updated Docker configs for DevOps release", time: "10:14" },
    { id: 2, text: "Jane Doe resolved Spring Boot JPA mapping warning", time: "09:45" },
    { id: 3, text: "Mark Smith created UI Mockups for Client Sprint 3", time: "Yesterday" }
  ]);

  // Live log simulation: add a new operation statement every 6 seconds!
  useEffect(() => {
    const mockTasks = [
      "NeonCoder deployed Frontend build update to staging site",
      "Jane Doe committed database optimization changes",
      "Sarah Jenkins triggered pipeline run #842",
      "Mark Smith approved UI redesign specifications",
      "Employee directory checked by HR Security agent"
    ];

    const interval = setInterval(() => {
      const randomTask = mockTasks[Math.floor(Math.random() * mockTasks.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      setLogs(prev => [
        { id: Date.now(), text: randomTask, time: timeStr },
        ...prev.slice(0, 4) // Keep max 5 logs in view
      ]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="workforce-home-page">
      <Navbar />

      <main className="workforce-home-content">
        
        {/* Banner header greeting */}
        <section className="wh-welcome-banner">
          <div className="wh-banner-content">
            <div className="wh-banner-text">
              <h1>Operations Console - Welcome, {user?.full_name || user?.username || "Manager"}!</h1>
              <p>Review system performance logs, allocate client project resources, and manage leave requests in real-time from your operations console dashboard.</p>
            </div>

            {/* Quick Stats Matrix */}
            <div className="wh-status-matrix">
              <div className="wh-matrix-item">
                <span className="wh-matrix-icon">👥</span>
                <div className="wh-matrix-info">
                  <span className="wh-matrix-label">Headcount</span>
                  <span className="wh-matrix-value">12 Members</span>
                </div>
              </div>
              <div className="wh-matrix-item">
                <span className="wh-matrix-icon">📂</span>
                <div className="wh-matrix-info">
                  <span className="wh-matrix-label">Active Projects</span>
                  <span className="wh-matrix-value">4 Systems</span>
                </div>
              </div>
              <div className="wh-matrix-item">
                <span className="wh-matrix-icon">🕒</span>
                <div className="wh-matrix-info">
                  <span className="wh-matrix-label">Pending Reviews</span>
                  <span className="wh-matrix-value">
                    {leaveQueue.filter(q => q.status === "PENDING").length} Items
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid Workspace */}
        <div className="wh-grid-layout">
          
          {/* Main Column */}
          <div className="wh-main-col">
            
            {/* Live Operations Feed Ticker */}
            <div className="wh-panel">
              <div className="wh-panel-header">
                <h3 className="wh-panel-title">Operations <span>Live Activity Feed</span></h3>
                <span style={{ fontSize: '12px', color: '#ff00c8', background: 'rgba(255, 0, 200, 0.08)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(255, 0, 200, 0.2)' }}>
                  ● LIVE FEED
                </span>
              </div>
              
              <div className="wh-live-log-container">
                {logs.map(log => (
                  <div key={log.id} className="wh-log-card">
                    <span className="wh-log-text">{log.text}</span>
                    <span className="wh-log-time">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Manager navigation matrices */}
            <div className="wh-panel">
              <div className="wh-panel-header">
                <h3 className="wh-panel-title">Operations <span>Quick Shortcuts</span></h3>
              </div>
              <div className="wh-shortcuts-grid">
                <div className="wh-shortcut-card" onClick={() => navigate('/workforce-home')}>
                  <span className="wh-shortcut-icon">⬢</span>
                  <h4>Home</h4>
                  <p>Return to the main operations workspace console homepage</p>
                </div>
                <div className="wh-shortcut-card" onClick={() => navigate('/workforce-features')}>
                  <span className="wh-shortcut-icon">📈</span>
                  <h4>Features</h4>
                  <p>Explore tool overviews built for operations management</p>
                </div>
                <div className="wh-shortcut-card" onClick={() => navigate('/workforce-dashboard')}>
                  <span className="wh-shortcut-icon">💼</span>
                  <h4>Dashboard</h4>
                  <p>Manage team headcount, allocate projects, and review leaves</p>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="wh-side-col">
            
            {/* Quick Action Leave Approvals Queue */}
            <div className="wh-panel">
              <div className="wh-panel-header">
                <h3 className="wh-panel-title">Action <span>Queue</span></h3>
              </div>
              <div className="wh-queue-list">
                {leaveQueue.map(item => (
                  <div key={item.id} className="wh-queue-card">
                    <div className="wh-queue-details">
                      <span className="wh-queue-requester">{item.name}</span>
                      <span style={{ fontSize: '11px', display: 'block', color: '#ff00c8', fontWeight: '600' }}>
                        {item.type}
                      </span>
                      <p style={{ marginTop: '5px', fontSize: '13px' }}>{item.desc}</p>
                    </div>
                    {item.status === "PENDING" ? (
                      <div className="wh-queue-actions">
                        <button className="wh-btn-approve" onClick={() => handleProcessLeave(item.id, "APPROVED")}>
                          Approve
                        </button>
                        <button className="wh-btn-reject" onClick={() => handleProcessLeave(item.id, "REJECTED")}>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`wh-queue-status-text ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* HR AI Helper Quick Box */}
            <div className="wh-panel" style={{ border: '1px dashed rgba(255, 0, 200, 0.2)' }}>
              <div className="wh-panel-header">
                <h3 className="wh-panel-title">SphereHR <span>Advisor</span></h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.5', marginBottom: '15px' }}>
                Need help with employee allocation or training recomendation? Launch a chat session with your AI resource assistant 🤖 in the bottom right corner of the page!
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '11px', background: 'rgba(255, 0, 200, 0.08)', color: '#ff00c8', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255, 0, 200, 0.15)' }}>#ResourceMgmt</span>
                <span style={{ fontSize: '11px', background: 'rgba(255, 0, 200, 0.08)', color: '#ff00c8', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255, 0, 200, 0.15)' }}>#TeamScore</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}

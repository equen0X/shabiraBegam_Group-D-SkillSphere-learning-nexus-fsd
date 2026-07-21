import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Background from "../components/Background";
import Footer from "../components/Footer";
import "../styles/workforceDashboard.css";

export default function WorkforceDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Employee Directory State
  const [employees, setEmployees] = useState([
    { id: 1, name: "Jane Doe", role: "Full-Stack Engineer", dept: "Engineering", status: "Active", score: 92 },
    { id: 2, name: "Mark Smith", role: "Product Manager", dept: "Product", status: "Active", score: 88 },
    { id: 3, name: "NeonCoder", role: "UX Developer", dept: "Design", status: "Active", score: 95 },
    { id: 4, name: "Sarah Jenkins", role: "DevOps specialist", dept: "Infrastructure", status: "On Leave", score: 85 }
  ]);

  // Project Allocation State
  const [projects, setProjects] = useState([
    { id: 1, title: "SkillSphere Mobile Platform Upgrade", assignee: "NeonCoder", progress: 60, priority: "High" },
    { id: 2, title: "OAuth2 & JWT Token Upgrades", assignee: "Jane Doe", progress: 35, priority: "Medium" },
    { id: 3, title: "Vite 6 Migration Strategy", assignee: "Sarah Jenkins", progress: 80, priority: "Low" }
  ]);

  // Leave Requests State
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: "Sarah Jenkins", type: "Sick Leave", details: "Requires 2 days off following dental surgery. (June 18-19)", status: "PENDING" },
    { id: 2, name: "Mark Smith", type: "Casual Leave", details: "Annual family getaway (3 days). (July 2-4)", status: "PENDING" }
  ]);

  // Modal States
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Form States
  const [newEmp, setNewEmp] = useState({ name: "", role: "", dept: "", status: "Active", score: 85 });
  const [newProj, setNewProj] = useState({ title: "", assignee: "", progress: 10, priority: "Medium" });

  // AI Assistant chatbot state
  const [chatMessages, setChatMessages] = useState([
    { sender: "assistant", text: "Welcome to Workforce AI Hub! I am SphereHR. Ask me about workforce metrics, employee performance ratings, or team resource planning." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  // Form Actions: Add Employee
  const handleAddEmployeeSubmit = (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.role || !newEmp.dept) return;

    setEmployees(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newEmp.name,
        role: newEmp.role,
        dept: newEmp.dept,
        status: newEmp.status,
        score: parseInt(newEmp.score) || 80
      }
    ]);
    // Reset and close
    setNewEmp({ name: "", role: "", dept: "", status: "Active", score: 85 });
    setShowEmployeeModal(false);
  };

  // Form Actions: Assign Project
  const handleAssignProjectSubmit = (e) => {
    e.preventDefault();
    if (!newProj.title || !newProj.assignee) return;

    setProjects(prev => [
      ...prev,
      {
        id: Date.now(),
        title: newProj.title,
        assignee: newProj.assignee,
        progress: parseInt(newProj.progress) || 10,
        priority: newProj.priority
      }
    ]);
    // Reset and close
    setNewProj({ title: "", assignee: "", progress: 10, priority: "Medium" });
    setShowProjectModal(false);
  };

  // Action: Approve/Reject Leave Request
  const handleLeaveDecision = (id, decision) => {
    setLeaveRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: decision } : req
    ));

    // If approved and the requester is in directory, set status to On Leave
    if (decision === "APPROVED") {
      const targetReq = leaveRequests.find(r => r.id === id);
      if (targetReq) {
        setEmployees(prev => prev.map(emp => 
          emp.name === targetReq.name ? { ...emp, status: "On Leave" } : emp
        ));
      }
    }
  };

  // Action: AI Mentor Submit
  const handleSendChat = async (text) => {
    if (!text.trim() || isChatLoading) return;

    const updated = [...chatMessages, { sender: "user", text }];
    setChatMessages(updated);
    setChatInput("");
    setIsChatLoading(true);

    const systemPrompt = `You are SphereHR, the virtual assistant and operations advisor for the workforce manager. You are highly knowledgeable about general queries, management best practices, technical topics, and team metrics. You have access to team metrics: Headcount: ${employees.length} members. Top Performer: NeonCoder (UX Developer) with 95%. Projects active: ${projects.length}. Pending leave requests: ${leaveRequests.filter(r => r.status === "PENDING").length}. Employees include: Jane Doe (Full-Stack Engineer), Mark Smith (Product Manager), NeonCoder (UX Developer), and Sarah Jenkins (DevOps Specialist). Answer queries with detailed insights and structural recommendations, maintaining a professional, highly expert HR advisor tone.`;

    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            ...chatMessages.slice(-6).map(m => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text
            })),
            { role: "user", content: text }
          ],
          model: "openai"
        })
      });

      if (!response.ok) throw new Error("API failed");
      const replyText = await response.text();
      setChatMessages(prev => [...prev, { sender: "assistant", text: replyText.trim() }]);
    } catch (err) {
      console.warn("AI Chat API error, falling back to local responder:", err);
      // Fallback local simulation
      setTimeout(() => {
        let reply = "I am processing your query. You can ask about 'performance', 'leaves', or 'projects' to check team resource allocations.";
        const query = text.toLowerCase();

        if (query.includes("performance") || query.includes("top performer") || query.includes("best")) {
          const top = [...employees].sort((a,b) => b.score - a.score)[0];
          reply = `${top.name} is the top performer with a score of ${top.score}% in the ${top.dept} department, followed closely by NeonCoder at 95%.`;
        } else if (query.includes("leave") || query.includes("holiday") || query.includes("pending")) {
          const pendingCount = leaveRequests.filter(r => r.status === "PENDING").length;
          reply = `There are currently ${pendingCount} pending leave requests requiring your review. It is recommended to check Mark Smith's casual leave as it coincides with upcoming sprint deadlines.`;
        } else if (query.includes("project") || query.includes("work") || query.includes("assign")) {
          reply = `We have ${projects.length} active projects tracked. NeonCoder is currently fully allocated on the 'Mobile Platform Upgrade', with 60% completion rate.`;
        } else if (query.includes("training") || query.includes("course") || query.includes("upskill")) {
          reply = "Recommended training programs based on skills matrix: Suggest enrolling Mark Smith in 'UI/UX & Gamification' and DevOps team in 'Infrastructure Automation' to boost delivery velocities.";
        }

        setChatMessages(prev => [...prev, { sender: "assistant", text: reply }]);
      }, 600);
    } finally {
      setIsChatLoading(false);
    }
  };

  const quickPrompts = [
    "Who is the top performer?",
    "Check pending leaves.",
    "Recommend training programs."
  ];

  return (
    <div className="wf-dashboard-page">
      <Background />
      <Navbar />

      <main className="wf-dashboard-content-wrapper">
        
        {/* Welcome Banner */}
        <section className="wf-welcome-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div className="wf-welcome-info">
            <h1>Welcome to Workforce Hub, {user?.full_name || user?.username || "Manager"}!</h1>
            <p>Monitor employee efficiency, assign development projects, and review leave requests from your operations panel.</p>
          </div>
          <button 
            onClick={() => navigate('/settings')}
            style={{
              background: 'linear-gradient(90deg, #ff00c8, #8a2eff)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '24px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(255, 0, 200, 0.4)'
            }}
          >
            ⚙️ Edit Profile Settings
          </button>
        </section>

        {/* Stats Grid */}
        <section className="wf-stats-grid">
          <div className="wf-stat-card">
            <div className="wf-stat-icon" style={{ background: "rgba(0, 229, 255, 0.1)", color: "#00e5ff" }}>👥</div>
            <div className="wf-stat-info">
              <h3>Active Headcount</h3>
              <div className="wf-stat-value">{employees.length} Members</div>
            </div>
          </div>
          <div className="wf-stat-card">
            <div className="wf-stat-icon" style={{ background: "rgba(138, 46, 255, 0.1)", color: "#8a2eff" }}>🚀</div>
            <div className="wf-stat-info">
              <h3>Projects Active</h3>
              <div className="wf-stat-value">{projects.length} Ongoing</div>
            </div>
          </div>
          <div className="wf-stat-card">
            <div className="wf-stat-icon" style={{ background: "rgba(57, 255, 20, 0.1)", color: "#39ff14" }}>⚡</div>
            <div className="wf-stat-info">
              <h3>Average Performance</h3>
              <div className="wf-stat-value">
                {Math.round(employees.reduce((acc, emp) => acc + emp.score, 0) / employees.length)}% Rating
              </div>
            </div>
          </div>
          <div className="wf-stat-card">
            <div className="wf-stat-icon" style={{ background: "rgba(255, 0, 200, 0.1)", color: "#ff00c8" }}>📋</div>
            <div className="wf-stat-info">
              <h3>Pending Leaves</h3>
              <div className="wf-stat-value">{leaveRequests.filter(r => r.status === "PENDING").length} Requests</div>
            </div>
          </div>
        </section>

        {/* Two-Column Layout */}
        <div className="wf-dashboard-layout">
          
          {/* Main Column */}
          <div className="wf-main-column">
            
            {/* Employee Directory Panel */}
            <div className="wf-dashboard-panel">
              <div className="wf-section-title-wrapper">
                <h2 className="wf-section-title">Employee Directory</h2>
                <button className="wf-btn-add" onClick={() => setShowEmployeeModal(true)}>
                  + Add Employee
                </button>
              </div>
              <div className="wf-table-responsive">
                <table className="wf-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Operations Role</th>
                      <th>Status</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id}>
                        <td>
                          <div className="wf-user-profile">
                            <div className="wf-user-avatar">
                              {emp.name.charAt(0)}
                            </div>
                            <span>{emp.name}</span>
                          </div>
                        </td>
                        <td>{emp.dept}</td>
                        <td>{emp.role}</td>
                        <td>
                          <span className={`wf-status-badge ${emp.status === "Active" ? "active" : "on-leave"}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td>
                          <span className="wf-perf-score">{emp.score}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Project Allocations Panel */}
            <div className="wf-dashboard-panel">
              <div className="wf-section-title-wrapper">
                <h2 className="wf-section-title">Project Allocations</h2>
                <button className="wf-btn-add" onClick={() => setShowProjectModal(true)}>
                  + Assign Project
                </button>
              </div>
              <div className="wf-projects-list">
                {projects.map(proj => (
                  <div key={proj.id} className="wf-project-card">
                    <div className="wf-project-header">
                      <div className="wf-project-title">
                        <h4>{proj.title}</h4>
                        <span className="wf-project-assignee">Assigned to: <strong>{proj.assignee}</strong></span>
                      </div>
                      <span className={`wf-priority-badge ${proj.priority.toLowerCase()}`}>
                        {proj.priority} Priority
                      </span>
                    </div>
                    <div className="wf-progress-container">
                      <div className="wf-progress-bar-bg">
                        <div 
                          className="wf-progress-bar-fill" 
                          style={{ width: `${proj.progress}%` }}
                        ></div>
                      </div>
                      <span className="wf-progress-pct">{proj.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sprint Capacity & Pipeline Metrics Panel */}
            <div className="wf-dashboard-panel">
              <div className="wf-section-title-wrapper">
                <h2 className="wf-section-title">Sprint Capacity & Operations Health</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '10px 0' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ fontSize: '12px', color: '#ff00c8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sprint Velocity</span>
                  <h4 style={{ margin: '5px 0 10px 0', fontSize: '20px', fontFamily: 'Orbitron' }}>88% Capacity</h4>
                  <div className="wf-progress-bar-bg" style={{ height: '6px' }}>
                    <div className="wf-progress-bar-fill" style={{ width: '88%', background: 'linear-gradient(90deg, #ff00c8, #8a2eff)' }}></div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ fontSize: '12px', color: '#00e5ff', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Team Allocation Load</span>
                  <h4 style={{ margin: '5px 0 10px 0', fontSize: '20px', fontFamily: 'Orbitron' }}>72% Engaged</h4>
                  <div className="wf-progress-bar-bg" style={{ height: '6px' }}>
                    <div className="wf-progress-bar-fill" style={{ width: '72%', background: 'linear-gradient(90deg, #00e5ff, #8a2eff)' }}></div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ fontSize: '12px', color: '#39ff14', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pipeline Status</span>
                  <h4 style={{ margin: '5px 0 5px 0', fontSize: '20px', fontFamily: 'Orbitron', color: '#39ff14' }}>● Healthy</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Uptime: 99.98%</span>
                </div>
              </div>
            </div>

            {/* Operations Live Activity Audit Log */}
            <div className="wf-dashboard-panel">
              <div className="wf-section-title-wrapper">
                <h2 className="wf-section-title">Live Audit Log</h2>
                <span style={{ fontSize: '11px', color: '#ff00c8', background: 'rgba(255, 0, 200, 0.08)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(255, 0, 200, 0.2)' }}>
                  SYSTEM LOGS
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto', paddingRight: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#e2e8f0' }}>✔ <strong>Jane Doe</strong> promoted database schema migration script #284 to staging environment</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>12 mins ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#e2e8f0' }}>✔ <strong>NeonCoder</strong> completed design layout task for SkillSphere Platform Upgrade</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>45 mins ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#e2e8f0' }}>✔ <strong>Sarah Jenkins</strong> resolved pipeline runner warnings for Docker images</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>1 hr ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#e2e8f0' }}>✔ <strong>Mark Smith</strong> updated the client sprint board milestones configuration</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>3 hrs ago</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="wf-sidebar-column">
            
            {/* Leave Approvals Widget */}
            <div className="wf-dashboard-panel">
              <div className="wf-section-title-wrapper">
                <h2 className="wf-section-title">Leave Approvals</h2>
              </div>
              <div className="wf-leave-list">
                {leaveRequests.map(req => (
                  <div key={req.id} className="wf-leave-item">
                    <div className="wf-leave-header">
                      <span className="wf-leave-requester">{req.name}</span>
                      <span className="wf-leave-type">{req.type}</span>
                    </div>
                    <p className="wf-leave-details">"{req.details}"</p>
                    
                    {req.status === "PENDING" ? (
                      <div className="wf-leave-actions">
                        <button className="wf-btn-reject" onClick={() => handleLeaveDecision(req.id, "REJECTED")}>
                          Reject
                        </button>
                        <button className="wf-btn-approve" onClick={() => handleLeaveDecision(req.id, "APPROVED")}>
                          Approve
                        </button>
                      </div>
                    ) : (
                      <span className={`wf-leave-status-final ${req.status.toLowerCase()}`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI HR Assistant Widget */}
            <div className="wf-dashboard-panel">
              <div className="wf-section-title-wrapper">
                <h2 className="wf-section-title">SphereHR AI</h2>
              </div>
              <div className="ai-mentor-panel">
                <div className="ai-chat-messages">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-bubble ${msg.sender === "assistant" ? "assistant" : "user"}`}>
                      {msg.text}
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="chat-bubble assistant" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(138, 46, 255, 0.08)' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>SphereHR is thinking...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="chat-hints">
                  {quickPrompts.map((hint, i) => (
                    <span 
                      key={i} 
                      className="chat-hint-tag"
                      onClick={() => handleSendChat(hint)}
                      style={isChatLoading ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                    >
                      {hint}
                    </span>
                  ))}
                </div>

                <div className="chat-input-wrapper">
                  <input 
                    type="text" 
                    className="chat-input"
                    placeholder="Ask SphereHR..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendChat(chatInput);
                    }}
                    disabled={isChatLoading}
                  />
                  <button 
                    className="chat-send-btn"
                    onClick={() => handleSendChat(chatInput)}
                    disabled={isChatLoading || !chatInput.trim()}
                    style={isChatLoading ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  >
                    🚀
                  </button>
                </div>
              </div>
            </div>

            {/* Corporate Training & Upskilling Programs Panel */}
            <div className="wf-dashboard-panel">
              <div className="wf-section-title-wrapper">
                <h2 className="wf-section-title">Upskilling Programs</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '5px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: '600' }}>Docker & Kubernetes Containerization</span>
                    <span style={{ color: '#ff00c8' }}>85% Complete</span>
                  </div>
                  <div className="wf-progress-bar-bg" style={{ height: '6px' }}>
                    <div className="wf-progress-bar-fill" style={{ width: '85%', background: '#ff00c8' }}></div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Enrolled: DevOps & Platform Team (4 Engineers)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: '600' }}>Advanced Spring Boot & JWT Security</span>
                    <span style={{ color: '#00e5ff' }}>40% Complete</span>
                  </div>
                  <div className="wf-progress-bar-bg" style={{ height: '6px' }}>
                    <div className="wf-progress-bar-fill" style={{ width: '40%', background: '#00e5ff' }}></div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Enrolled: Backend Engineers & QA (6 Members)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: '600' }}>Vite 6 & React Concurrent Rendering</span>
                    <span style={{ color: '#22c55e' }}>90% Complete</span>
                  </div>
                  <div className="wf-progress-bar-bg" style={{ height: '6px' }}>
                    <div className="wf-progress-bar-fill" style={{ width: '90%', background: '#22c55e' }}></div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Enrolled: Frontend Team (3 Developers)</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Modal: Add Employee */}
      {showEmployeeModal && (
        <div className="wf-modal-overlay">
          <div className="wf-modal">
            <h3>Add New Employee</h3>
            <form onSubmit={handleAddEmployeeSubmit}>
              <div className="wf-form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="wf-form-input" 
                  placeholder="e.g. Alice Cooper"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  required
                />
              </div>
              <div className="wf-form-group">
                <label>Operations Role</label>
                <input 
                  type="text" 
                  className="wf-form-input" 
                  placeholder="e.g. Lead QA Specialist"
                  value={newEmp.role}
                  onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                  required
                />
              </div>
              <div className="wf-form-group">
                <label>Department</label>
                <input 
                  type="text" 
                  className="wf-form-input" 
                  placeholder="e.g. Engineering"
                  value={newEmp.dept}
                  onChange={(e) => setNewEmp({ ...newEmp, dept: e.target.value })}
                  required
                />
              </div>
              <div className="wf-form-group">
                <label>Initial Performance Score (%)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100"
                  className="wf-form-input" 
                  value={newEmp.score}
                  onChange={(e) => setNewEmp({ ...newEmp, score: e.target.value })}
                  required
                />
              </div>
              <div className="wf-modal-actions">
                <button type="button" className="wf-btn-cancel" onClick={() => setShowEmployeeModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="wf-btn-add">
                  Register Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Project */}
      {showProjectModal && (
        <div className="wf-modal-overlay">
          <div className="wf-modal">
            <h3>Assign New Project</h3>
            <form onSubmit={handleAssignProjectSubmit}>
              <div className="wf-form-group">
                <label>Project Title</label>
                <input 
                  type="text" 
                  className="wf-form-input" 
                  placeholder="e.g. REST API Database Optimizations"
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  required
                />
              </div>
              <div className="wf-form-group">
                <label>Assignee</label>
                <select 
                  className="wf-form-input" 
                  style={{ background: "#0f172a" }}
                  value={newProj.assignee}
                  onChange={(e) => setNewProj({ ...newProj, assignee: e.target.value })}
                  required
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name} ({emp.dept})</option>
                  ))}
                </select>
              </div>
              <div className="wf-form-group">
                <label>Priority</label>
                <select 
                  className="wf-form-input" 
                  style={{ background: "#0f172a" }}
                  value={newProj.priority}
                  onChange={(e) => setNewProj({ ...newProj, priority: e.target.value })}
                  required
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
              <div className="wf-form-group">
                <label>Initial Completion Progress (%)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  className="wf-form-input" 
                  value={newProj.progress}
                  onChange={(e) => setNewProj({ ...newProj, progress: e.target.value })}
                  required
                />
              </div>
              <div className="wf-modal-actions">
                <button type="button" className="wf-btn-cancel" onClick={() => setShowProjectModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="wf-btn-add">
                  Assign Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Background from "../components/Background";
import Footer from "../components/Footer";
import "../styles/workforceHome.css";

// ── 2026 Indian Public Holidays ───────────────────────────────────────────────
const HOLIDAYS_2026 = [
  { date: "2026-01-01", name: "New Year's Day",                  type: "national" },
  { date: "2026-01-14", name: "Makar Sankranti / Pongal",         type: "national" },
  { date: "2026-01-26", name: "Republic Day",                     type: "national" },
  { date: "2026-02-26", name: "Maha Shivaratri",                  type: "regional" },
  { date: "2026-03-25", name: "Holi",                             type: "national" },
  { date: "2026-04-02", name: "Ram Navami",                       type: "national" },
  { date: "2026-04-03", name: "Good Friday",                      type: "national" },
  { date: "2026-04-14", name: "Dr. Ambedkar Jayanti / Baisakhi",  type: "national" },
  { date: "2026-05-01", name: "Labour Day / Maharashtra Day",     type: "national" },
  { date: "2026-05-27", name: "Buddha Purnima",                   type: "national" },
  { date: "2026-06-27", name: "Eid al-Adha",                      type: "national" },
  { date: "2026-08-15", name: "Independence Day",                 type: "national" },
  { date: "2026-08-26", name: "Janmashtami",                      type: "national" },
  { date: "2026-09-10", name: "Ganesh Chaturthi",                 type: "regional" },
  { date: "2026-10-02", name: "Gandhi Jayanti",                   type: "national" },
  { date: "2026-10-20", name: "Dussehra",                         type: "national" },
  { date: "2026-10-19", name: "Diwali (Lakshmi Puja)",            type: "national" },
  { date: "2026-10-21", name: "Bhai Dooj",                        type: "regional" },
  { date: "2026-11-10", name: "Guru Nanak Jayanti",               type: "national" },
  { date: "2026-11-14", name: "Children's Day",                   type: "national" },
  { date: "2026-12-25", name: "Christmas Day",                    type: "national" },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function WorkforceHome() {
  const { user, workforceTheme, updateWorkforceTheme } = useAuth();
  const navigate = useNavigate();

  // ─── Scoped Workforce Theme ───────────────────────────────────────────────
  const theme = workforceTheme || "dark";

  useEffect(() => {
    document.documentElement.setAttribute("data-wf-theme", theme);
    return () => {
      document.documentElement.removeAttribute("data-wf-theme");
    };
  }, [theme]);

  const toggleTheme = () => updateWorkforceTheme(theme === "dark" ? "light" : "dark");

  // ─── Holiday Calendar ────────────────────────────────────────────────────
  const todayDate = new Date();
  const [calYear,  setCalYear]  = useState(todayDate.getFullYear());
  const [calMonth, setCalMonth] = useState(todayDate.getMonth());

  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11); } else setCalMonth(m => m-1); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0);  } else setCalMonth(m => m+1); };

  const calCells = () => {
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay    = new Date(calYear, calMonth, 1).getDay();
    const cells       = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const getHoliday = (day) => {
    if (!day) return null;
    const ds = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return HOLIDAYS_2026.find(h => h.date === ds) || null;
  };

  const isToday = (day) =>
    day && calYear === todayDate.getFullYear() && calMonth === todayDate.getMonth() && day === todayDate.getDate();

  const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth()+1).padStart(2,'0')}-${String(todayDate.getDate()).padStart(2,'0')}`;
  const upcomingHolidays = HOLIDAYS_2026.filter(h => h.date >= todayStr).slice(0, 5);

  // ─── Employee Directory ──────────────────────────────────────────────────
  const [employees, setEmployees] = useState([
    { id: 1, name: "Jane Doe",      role: "Full-Stack Engineer",  dept: "Engineering",    status: "Active",   score: 92 },
    { id: 2, name: "Mark Smith",    role: "Product Manager",       dept: "Product",        status: "Active",   score: 88 },
    { id: 3, name: "NeonCoder",     role: "UX Developer",          dept: "Design",         status: "Active",   score: 95 },
    { id: 4, name: "Sarah Jenkins", role: "DevOps Specialist",     dept: "Infrastructure", status: "On Leave", score: 85 }
  ]);

  // ─── Project Allocations ─────────────────────────────────────────────────
  const [projects, setProjects] = useState([
    { id: 1, title: "SkillSphere Mobile Platform Upgrade",  assignee: "NeonCoder",     progress: 60, priority: "High"   },
    { id: 2, title: "OAuth2 & JWT Token Upgrades",          assignee: "Jane Doe",      progress: 35, priority: "Medium" },
    { id: 3, title: "Vite 6 Migration Strategy",            assignee: "Sarah Jenkins", progress: 80, priority: "Low"    }
  ]);

  // ─── Leave Requests ──────────────────────────────────────────────────────
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: "Sarah Jenkins", type: "Sick Leave",   details: "Requires 2 days off following dental surgery. (June 18-19)", status: "PENDING" },
    { id: 2, name: "Mark Smith",    type: "Casual Leave", details: "Annual family getaway (3 days). (July 2-4)",                  status: "PENDING" }
  ]);

  // ─── Modal / Form States ─────────────────────────────────────────────────
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showProjectModal,  setShowProjectModal]  = useState(false);
  const [newEmp,  setNewEmp]  = useState({ name: "", role: "", dept: "", status: "Active", score: 85 });
  const [newProj, setNewProj] = useState({ title: "", assignee: "", progress: 10, priority: "Medium" });

  // ─── Live Operations Log ─────────────────────────────────────────────────
  const [logs, setLogs] = useState([
    { id: 1, text: "Sarah Jenkins updated Docker configs for DevOps release",       time: "10:14"     },
    { id: 2, text: "Jane Doe resolved Spring Boot JPA mapping warning",              time: "09:45"     },
    { id: 3, text: "Mark Smith created UI Mockups for Client Sprint 3",              time: "Yesterday" }
  ]);

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
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      setLogs(prev => [{ id: Date.now(), text: randomTask, time: timeStr }, ...prev.slice(0, 4)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // ─── AI HR Assistant ─────────────────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState([
    { sender: "assistant", text: "Welcome to Workforce AI Hub! I am SphereHR. Ask me about workforce metrics, employee performance ratings, or team resource planning." }
  ]);
  const [chatInput,     setChatInput]     = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  // ─── Actions ─────────────────────────────────────────────────────────────
  const handleAddEmployeeSubmit = (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.role || !newEmp.dept) return;
    setEmployees(prev => [...prev, { id: Date.now(), ...newEmp, score: parseInt(newEmp.score) || 80 }]);
    setNewEmp({ name: "", role: "", dept: "", status: "Active", score: 85 });
    setShowEmployeeModal(false);
  };

  const handleAssignProjectSubmit = (e) => {
    e.preventDefault();
    if (!newProj.title || !newProj.assignee) return;
    setProjects(prev => [...prev, { id: Date.now(), ...newProj, progress: parseInt(newProj.progress) || 10 }]);
    setNewProj({ title: "", assignee: "", progress: 10, priority: "Medium" });
    setShowProjectModal(false);
  };

  const handleLeaveDecision = (id, decision) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: decision } : req));
    if (decision === "APPROVED") {
      const target = leaveRequests.find(r => r.id === id);
      if (target) setEmployees(prev => prev.map(emp => emp.name === target.name ? { ...emp, status: "On Leave" } : emp));
    }
  };

  const handleSendChat = async (text) => {
    if (!text.trim() || isChatLoading) return;
    setChatMessages(prev => [...prev, { sender: "user", text }]);
    setChatInput("");
    setIsChatLoading(true);

    const systemPrompt = `You are SphereHR, the virtual assistant and operations advisor for the workforce manager. You are highly knowledgeable about general queries, management best practices, technical topics, and team metrics. Headcount: ${employees.length} members. Top Performer: NeonCoder (95%). Projects active: ${projects.length}. Pending leave requests: ${leaveRequests.filter(r => r.status === "PENDING").length}. Answer with detailed insights, professional HR advisor tone.`;

    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            ...chatMessages.slice(-6).map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: text }
          ],
          model: "openai"
        })
      });
      if (!response.ok) throw new Error("API failed");
      const replyText = await response.text();
      setChatMessages(prev => [...prev, { sender: "assistant", text: replyText.trim() }]);
    } catch {
      setTimeout(() => {
        let reply = "I am processing your query. Ask about 'performance', 'leaves', or 'projects'.";
        const q = text.toLowerCase();
        if (q.includes("performance") || q.includes("top performer")) {
          const top = [...employees].sort((a, b) => b.score - a.score)[0];
          reply = `${top.name} is the top performer with a score of ${top.score}% in the ${top.dept} department.`;
        } else if (q.includes("leave") || q.includes("pending")) {
          reply = `There are ${leaveRequests.filter(r => r.status === "PENDING").length} pending leave requests requiring your review.`;
        } else if (q.includes("project") || q.includes("assign")) {
          reply = `We have ${projects.length} active projects tracked.`;
        }
        setChatMessages(prev => [...prev, { sender: "assistant", text: reply }]);
      }, 600);
    } finally {
      setIsChatLoading(false);
    }
  };

  const quickPrompts = ["Who is the top performer?", "Check pending leaves.", "Recommend training programs."];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`wf-home-page theme-${theme}`}>
      <Background />
      <Navbar />

      <main className="wf-home-content">

        {/* ── Welcome Banner ── */}
        <section className="wf-home-welcome-card">
          <div className="wf-home-welcome-info">
            <h1>Operations Console — Welcome, {user?.full_name || user?.username || "Manager"}!</h1>
            <p>Monitor employee efficiency, assign development projects, and review leave requests from your operations panel.</p>
          </div>

          <div className="wf-home-header-actions">
            {/* Theme Toggle */}
            <button
              id="wf-theme-toggle-btn"
              className={`wf-theme-toggle ${theme}`}
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <span className="wf-theme-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
              <span className="wf-theme-label">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>

            {/* Edit Profile */}
            <button
              id="wf-edit-profile-btn"
              className="wf-edit-profile-btn"
              onClick={() => navigate("/settings")}
            >
              ⚙️ Edit Profile Settings
            </button>
          </div>
        </section>

        {/* ── Stats Grid ── */}
        <section className="wf-home-stats-grid">
          {/* Active Headcount */}
          <div className="wf-home-stat-card theme-cyan">
            <div className="wf-stat-card-top-bar" />
            <div className="wf-stat-header">
              <div className="wf-home-stat-icon">👥</div>
              <span className="wf-stat-badge cyan">Active Team</span>
            </div>
            <div className="wf-home-stat-info">
              <h3>Active Headcount</h3>
              <div className="wf-home-stat-value">
                <span className="stat-number">{employees.length}</span>
                <span className="stat-label">Members</span>
              </div>
            </div>
            <div className="wf-stat-progress-bg">
              <div className="wf-stat-progress-bar cyan" style={{ width: "100%" }} />
            </div>
          </div>

          {/* Projects Active */}
          <div className="wf-home-stat-card theme-purple">
            <div className="wf-stat-card-top-bar" />
            <div className="wf-stat-header">
              <div className="wf-home-stat-icon">🚀</div>
              <span className="wf-stat-badge purple">On Track</span>
            </div>
            <div className="wf-home-stat-info">
              <h3>Projects Active</h3>
              <div className="wf-home-stat-value">
                <span className="stat-number">{projects.length}</span>
                <span className="stat-label">Ongoing</span>
              </div>
            </div>
            <div className="wf-stat-progress-bg">
              <div className="wf-stat-progress-bar purple" style={{ width: "75%" }} />
            </div>
          </div>

          {/* Average Performance */}
          <div className="wf-home-stat-card theme-emerald">
            <div className="wf-stat-card-top-bar" />
            <div className="wf-stat-header">
              <div className="wf-home-stat-icon">⚡</div>
              <span className="wf-stat-badge emerald">Optimal</span>
            </div>
            <div className="wf-home-stat-info">
              <h3>Average Performance</h3>
              <div className="wf-home-stat-value">
                <span className="stat-number">
                  {Math.round(employees.reduce((acc, e) => acc + e.score, 0) / (employees.length || 1))}%
                </span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
            <div className="wf-stat-progress-bg">
              <div
                className="wf-stat-progress-bar emerald"
                style={{
                  width: `${Math.round(employees.reduce((acc, e) => acc + e.score, 0) / (employees.length || 1))}%`
                }}
              />
            </div>
          </div>

          {/* Pending Leaves */}
          <div className="wf-home-stat-card theme-pink">
            <div className="wf-stat-card-top-bar" />
            <div className="wf-stat-header">
              <div className="wf-home-stat-icon">📋</div>
              <span className="wf-stat-badge pink">
                {leaveRequests.filter(r => r.status === "PENDING").length > 0 ? "Action Req" : "All Clear"}
              </span>
            </div>
            <div className="wf-home-stat-info">
              <h3>Pending Leaves</h3>
              <div className="wf-home-stat-value">
                <span className="stat-number">{leaveRequests.filter(r => r.status === "PENDING").length}</span>
                <span className="stat-label">Requests</span>
              </div>
            </div>
            <div className="wf-stat-progress-bg">
              <div
                className="wf-stat-progress-bar pink"
                style={{
                  width: leaveRequests.filter(r => r.status === "PENDING").length > 0 ? "50%" : "0%"
                }}
              />
            </div>
          </div>
        </section>

        {/* ── Two-Column Layout ── */}
        <div className="wf-home-layout">

          {/* ── Main Column ── */}
          <div className="wf-home-main-col">

            {/* Employee Directory */}
            <div className="wf-home-panel">
              <div className="wf-home-section-header">
                <h2 className="wf-home-section-title">Employee Directory</h2>
                <button className="wf-home-btn-add" onClick={() => setShowEmployeeModal(true)}>+ Add Employee</button>
              </div>
              <div className="wf-home-table-wrap">
                <table className="wf-home-table">
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
                          <div className="wf-home-user-profile">
                            <div className="wf-home-user-avatar">{emp.name.charAt(0)}</div>
                            <span>{emp.name}</span>
                          </div>
                        </td>
                        <td>{emp.dept}</td>
                        <td>{emp.role}</td>
                        <td>
                          <span className={`wf-home-status-badge ${emp.status === "Active" ? "active" : "on-leave"}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td><span className="wf-home-perf-score">{emp.score}%</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Project Allocations */}
            <div className="wf-home-panel">
              <div className="wf-home-section-header">
                <h2 className="wf-home-section-title">Project Allocations</h2>
                <button className="wf-home-btn-add" onClick={() => setShowProjectModal(true)}>+ Assign Project</button>
              </div>
              <div className="wf-home-projects-list">
                {projects.map(proj => (
                  <div key={proj.id} className="wf-home-project-card">
                    <div className="wf-home-project-header">
                      <div>
                        <h4>{proj.title}</h4>
                        <span className="wf-home-project-assignee">Assigned to: <strong>{proj.assignee}</strong></span>
                      </div>
                      <span className={`wf-home-priority-badge ${proj.priority.toLowerCase()}`}>{proj.priority} Priority</span>
                    </div>
                    <div className="wf-home-progress-container">
                      <div className="wf-home-progress-bg">
                        <div className="wf-home-progress-fill" style={{ width: `${proj.progress}%` }}></div>
                      </div>
                      <span className="wf-home-progress-pct">{proj.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sprint Capacity */}
            <div className="wf-home-panel">
              <div className="wf-home-section-header">
                <h2 className="wf-home-section-title">Sprint Capacity & Operations Health</h2>
              </div>
              <div className="wf-home-capacity-grid">
                <div className="wf-home-capacity-item">
                  <span className="wf-home-capacity-label" style={{ color: "#ff00c8" }}>Sprint Velocity</span>
                  <h4 className="wf-home-capacity-val">88% Capacity</h4>
                  <div className="wf-home-progress-bg"><div className="wf-home-progress-fill" style={{ width: "88%", background: "linear-gradient(90deg,#ff00c8,#8a2eff)" }}></div></div>
                </div>
                <div className="wf-home-capacity-item">
                  <span className="wf-home-capacity-label" style={{ color: "#00e5ff" }}>Team Allocation Load</span>
                  <h4 className="wf-home-capacity-val">72% Engaged</h4>
                  <div className="wf-home-progress-bg"><div className="wf-home-progress-fill" style={{ width: "72%", background: "linear-gradient(90deg,#00e5ff,#8a2eff)" }}></div></div>
                </div>
                <div className="wf-home-capacity-item">
                  <span className="wf-home-capacity-label" style={{ color: "#39ff14" }}>Pipeline Status</span>
                  <h4 className="wf-home-capacity-val" style={{ color: "#39ff14" }}>● Healthy</h4>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Uptime: 99.98%</span>
                </div>
              </div>
            </div>

            {/* Live Audit Log */}
            <div className="wf-home-panel">
              <div className="wf-home-section-header">
                <h2 className="wf-home-section-title">Live Audit Log</h2>
                <span className="wf-home-live-badge">● LIVE FEED</span>
              </div>
              <div className="wf-home-log-list">
                {logs.map(log => (
                  <div key={log.id} className="wf-home-log-card">
                    <span className="wf-home-log-text">{log.text}</span>
                    <span className="wf-home-log-time">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Company OKRs & Goals ── */}
            <div className="wf-home-panel">
              <div className="wf-home-section-header">
                <h2 className="wf-home-section-title">Company OKRs &amp; Goals</h2>
                <span style={{ fontSize: "12px", color: "#facc15", fontWeight: "700", fontFamily: "'Orbitron',sans-serif" }}>Q3 2026</span>
              </div>
              {[
                { obj: "Launch SkillSphere v2.0 Platform", owner: "Engineering", pct: 78, color: "#00e5ff" },
                { obj: "Onboard 500 Enterprise Clients",   owner: "Sales",       pct: 52, color: "#ff00c8" },
                { obj: "Achieve 99.9% Uptime SLA",         owner: "DevOps",      pct: 91, color: "#39ff14" },
                { obj: "Reduce Avg. Training Time by 30%", owner: "L&D",         pct: 64, color: "#facc15" },
                { obj: "Ship AI Tutor Feature",            owner: "Product",     pct: 38, color: "#8a2eff" },
              ].map(okr => (
                <div key={okr.obj} className="wf-home-capacity-item" style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--wf-text-primary)" }}>{okr.obj}</span>
                    <span style={{ fontSize: "11px", color: okr.color, fontWeight: "700", fontFamily: "'Orbitron',sans-serif", flexShrink: 0, marginLeft: "8px" }}>{okr.pct}%</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--wf-text-faint)", display: "block", marginBottom: "6px" }}>Owner: {okr.owner}</span>
                  <div className="wf-home-progress-bg">
                    <div className="wf-home-progress-fill" style={{ width: `${okr.pct}%`, background: `linear-gradient(90deg,${okr.color},${okr.color}99)` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* ── Team Activity Heatmap ── */}
            <div className="wf-home-panel">
              <div className="wf-home-section-header">
                <h2 className="wf-home-section-title">Team Activity — Last 7 Days</h2>
                <span style={{ fontSize: "12px", color: "#39ff14", fontWeight: "700" }}>● Live</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", color: "var(--wf-text-faint)", fontWeight: "700", padding: "4px 8px 10px 0", fontSize: "11px" }}>Engineer</th>
                      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                        <th key={d} style={{ color: "var(--wf-text-faint)", fontWeight: "700", padding: "4px 6px 10px", fontSize: "11px", textAlign: "center" }}>{d}</th>
                      ))}
                      <th style={{ color: "var(--wf-text-faint)", fontWeight: "700", padding: "4px 0 10px 10px", fontSize: "11px" }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Jane Doe",   data: ["🔥","✅","✅","🔥","✅","–","–"], score: 92 },
                      { name: "NeonCoder",  data: ["✅","🔥","🔥","✅","🔥","✅","–"], score: 95 },
                      { name: "Mark Smith", data: ["✅","✅","⚠️","✅","✅","–","–"],  score: 88 },
                      { name: "S. Jenkins", data: ["🔥","✅","✅","✅","–","–","–"],   score: 85 },
                    ].map(row => (
                      <tr key={row.name} style={{ borderTop: "1px solid var(--wf-panel-border)" }}>
                        <td style={{ padding: "9px 8px 9px 0", fontWeight: "700", color: "var(--wf-text-primary)", fontSize: "13px", whiteSpace: "nowrap" }}>{row.name}</td>
                        {row.data.map((cell, ci) => (
                          <td key={ci} style={{ textAlign: "center", padding: "9px 6px", fontSize: "15px" }}>{cell}</td>
                        ))}
                        <td style={{ padding: "9px 0 9px 10px", fontWeight: "800", color: "#39ff14", fontFamily: "'Orbitron',sans-serif", fontSize: "12px" }}>{row.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", gap: "14px", marginTop: "12px", paddingTop: "10px", borderTop: "1px solid var(--wf-panel-border)", fontSize: "11px", color: "var(--wf-text-faint)", flexWrap: "wrap" }}>
                <span>🔥 High output</span><span>✅ On track</span><span>⚠️ Needs attention</span><span>– Offline</span>
              </div>
            </div>

          </div>

          {/* ── Sidebar Column ── */}
          <div className="wf-home-side-col">

            {/* ── Holiday Calendar ── */}
            <div className="wf-home-panel">
              <div className="wf-home-section-header">
                <h2 className="wf-home-section-title">Holiday Calendar</h2>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '12px', color: '#ff00c8', fontWeight: '700' }}>{calYear}</span>
              </div>

              {/* Month Navigation */}
              <div className="wf-cal-nav">
                <button className="wf-cal-nav-btn" onClick={prevMonth}>‹</button>
                <span className="wf-cal-month-label">{MONTH_NAMES[calMonth]}</span>
                <button className="wf-cal-nav-btn" onClick={nextMonth}>›</button>
              </div>

              {/* Day Grid */}
              <div className="wf-cal-grid">
                {DAY_NAMES.map(d => (
                  <div key={d} className="wf-cal-day-header">{d}</div>
                ))}
                {calCells().map((day, i) => {
                  const holiday = getHoliday(day);
                  const todayCell = isToday(day);
                  return (
                    <div
                      key={i}
                      className={`wf-cal-cell${!day ? " empty" : ""}${todayCell ? " today" : ""}${holiday ? ` holiday-${holiday.type}` : ""}`}
                      title={holiday ? holiday.name : (todayCell ? "Today" : "")}
                    >
                      {day || ""}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="wf-cal-legend">
                <span className="wf-cal-legend-item national">National</span>
                <span className="wf-cal-legend-item regional">Regional</span>
                <span className="wf-cal-legend-item today-leg">Today</span>
              </div>

              {/* Upcoming Holidays */}
              <div className="wf-cal-upcoming">
                <div className="wf-cal-upcoming-title">Upcoming Holidays</div>
                {upcomingHolidays.length === 0 ? (
                  <p style={{ color: 'var(--wf-text-faint)', fontSize: '13px', margin: 0 }}>No more holidays this year 🎉</p>
                ) : (
                  upcomingHolidays.map(h => (
                    <div key={h.date} className="wf-cal-upcoming-item">
                      <div className={`wf-cal-upcoming-dot ${h.type}`} />
                      <div>
                        <div className="wf-cal-upcoming-name">{h.name}</div>
                        <div className="wf-cal-upcoming-date">
                          {new Date(h.date + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Leave Approvals */}
            <div className="wf-home-panel">
              <div className="wf-home-section-header">
                <h2 className="wf-home-section-title">Leave Approvals</h2>
              </div>
              <div className="wf-home-leave-list">
                {leaveRequests.map(req => (
                  <div key={req.id} className="wf-home-leave-item">
                    <div className="wf-home-leave-header">
                      <span className="wf-home-leave-requester">{req.name}</span>
                      <span className="wf-home-leave-type">{req.type}</span>
                    </div>
                    <p className="wf-home-leave-details">"{req.details}"</p>
                    {req.status === "PENDING" ? (
                      <div className="wf-home-leave-actions">
                        <button className="wf-home-btn-reject" onClick={() => handleLeaveDecision(req.id, "REJECTED")}>Reject</button>
                        <button className="wf-home-btn-approve" onClick={() => handleLeaveDecision(req.id, "APPROVED")}>Approve</button>
                      </div>
                    ) : (
                      <span className={`wf-home-leave-status ${req.status.toLowerCase()}`}>{req.status}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI HR Assistant */}
            <div className="wf-home-panel">
              <div className="wf-home-section-header">
                <h2 className="wf-home-section-title">SphereHR AI</h2>
              </div>
              <div className="wf-home-chat-panel">
                <div className="wf-home-chat-messages">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`wf-home-chat-bubble ${msg.sender}`}>{msg.text}</div>
                  ))}
                  {isChatLoading && (
                    <div className="wf-home-chat-bubble assistant">
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>SphereHR is thinking...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="wf-home-chat-hints">
                  {quickPrompts.map((hint, i) => (
                    <span key={i} className="wf-home-chat-hint" onClick={() => handleSendChat(hint)}
                      style={isChatLoading ? { pointerEvents: "none", opacity: 0.5 } : {}}>{hint}</span>
                  ))}
                </div>
                <div className="wf-home-chat-input-row">
                  <input
                    type="text"
                    className="wf-home-chat-input"
                    placeholder="Ask SphereHR..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleSendChat(chatInput); }}
                    disabled={isChatLoading}
                  />
                  <button
                    className="wf-home-chat-send"
                    onClick={() => handleSendChat(chatInput)}
                    disabled={isChatLoading || !chatInput.trim()}
                  >🚀</button>
                </div>
              </div>
            </div>

            {/* Upskilling Programs */}
            <div className="wf-home-panel">
              <div className="wf-home-section-header">
                <h2 className="wf-home-section-title">Upskilling Programs</h2>
              </div>
              <div className="wf-home-upskill-list">
                {[
                  { label: "Docker & Kubernetes Containerization", pct: 85, color: "#ff00c8", enrolled: "DevOps & Platform Team (4 Engineers)" },
                  { label: "Advanced Spring Boot & JWT Security",  pct: 40, color: "#00e5ff", enrolled: "Backend Engineers & QA (6 Members)"  },
                  { label: "Vite 6 & React Concurrent Rendering",  pct: 90, color: "#22c55e", enrolled: "Frontend Team (3 Developers)"         }
                ].map((item, i) => (
                  <div key={i} className="wf-home-upskill-item">
                    <div className="wf-home-upskill-row">
                      <span className="wf-home-upskill-name">{item.label}</span>
                      <span style={{ color: item.color }}>{item.pct}% Complete</span>
                    </div>
                    <div className="wf-home-progress-bg">
                      <div className="wf-home-progress-fill" style={{ width: `${item.pct}%`, background: item.color }}></div>
                    </div>
                    <span className="wf-home-upskill-enrolled">Enrolled: {item.enrolled}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="wf-home-panel">
              <div className="wf-home-section-header">
                <h2 className="wf-home-section-title">Quick Navigation</h2>
              </div>
              <div className="wf-home-shortcuts-grid">
                {[
                  { icon: "⬢",  label: "Home",         desc: "Return to the main operations workspace",     path: "/workforce-home"     },
                  { icon: "📈", label: "Features",     desc: "Explore tools built for operations managers", path: "/workforce-features" },
                  { icon: "💼", label: "Dashboard",    desc: "Manage headcount, allocate projects & leaves", path: "/workforce-dashboard"},
                  { icon: "⚙️", label: "Profile",      desc: "Edit account, password & profile settings",   path: "/settings"           }
                ].map((s, i) => (
                  <div key={i} className="wf-home-shortcut-card" onClick={() => navigate(s.path)}>
                    <span className="wf-home-shortcut-icon">{s.icon}</span>
                    <h4>{s.label}</h4>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Modal: Add Employee ── */}
      {showEmployeeModal && (
        <div className="wf-home-modal-overlay" onClick={() => setShowEmployeeModal(false)}>
          <div className="wf-home-modal" onClick={e => e.stopPropagation()}>
            <h3>Add New Employee</h3>
            <form onSubmit={handleAddEmployeeSubmit}>
              {[
                { label: "Full Name",                   key: "name",  placeholder: "e.g. Alice Cooper",        type: "text"   },
                { label: "Operations Role",             key: "role",  placeholder: "e.g. Lead QA Specialist",  type: "text"   },
                { label: "Department",                  key: "dept",  placeholder: "e.g. Engineering",         type: "text"   },
                { label: "Initial Performance Score %", key: "score", placeholder: "85",                       type: "number" }
              ].map(f => (
                <div key={f.key} className="wf-home-form-group">
                  <label>{f.label}</label>
                  <input type={f.type} className="wf-home-form-input" placeholder={f.placeholder}
                    value={newEmp[f.key]}
                    onChange={e => setNewEmp({ ...newEmp, [f.key]: e.target.value })}
                    min={f.type === "number" ? 0 : undefined}
                    max={f.type === "number" ? 100 : undefined}
                    required />
                </div>
              ))}
              <div className="wf-home-modal-actions">
                <button type="button" className="wf-home-btn-cancel" onClick={() => setShowEmployeeModal(false)}>Cancel</button>
                <button type="submit" className="wf-home-btn-add">Register Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Assign Project ── */}
      {showProjectModal && (
        <div className="wf-home-modal-overlay" onClick={() => setShowProjectModal(false)}>
          <div className="wf-home-modal" onClick={e => e.stopPropagation()}>
            <h3>Assign New Project</h3>
            <form onSubmit={handleAssignProjectSubmit}>
              <div className="wf-home-form-group">
                <label>Project Title</label>
                <input type="text" className="wf-home-form-input" placeholder="e.g. REST API Optimizations"
                  value={newProj.title} onChange={e => setNewProj({ ...newProj, title: e.target.value })} required />
              </div>
              <div className="wf-home-form-group">
                <label>Assignee</label>
                <select className="wf-home-form-input wf-home-form-select"
                  value={newProj.assignee} onChange={e => setNewProj({ ...newProj, assignee: e.target.value })} required>
                  <option value="">-- Choose Employee --</option>
                  {employees.map(emp => <option key={emp.id} value={emp.name}>{emp.name} ({emp.dept})</option>)}
                </select>
              </div>
              <div className="wf-home-form-group">
                <label>Priority</label>
                <select className="wf-home-form-input wf-home-form-select"
                  value={newProj.priority} onChange={e => setNewProj({ ...newProj, priority: e.target.value })} required>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
              <div className="wf-home-form-group">
                <label>Initial Progress %</label>
                <input type="number" min="0" max="100" className="wf-home-form-input"
                  value={newProj.progress} onChange={e => setNewProj({ ...newProj, progress: e.target.value })} required />
              </div>
              <div className="wf-home-modal-actions">
                <button type="button" className="wf-home-btn-cancel" onClick={() => setShowProjectModal(false)}>Cancel</button>
                <button type="submit" className="wf-home-btn-add">Assign Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

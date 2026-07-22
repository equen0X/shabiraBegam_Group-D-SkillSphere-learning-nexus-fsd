import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Background from "../components/Background";
import Footer from "../components/Footer";
import "../styles/teamSpace.css";

const INITIAL_CHANNELS = [
  { id: "general",       name: "# general",        icon: "💬", desc: "Team-wide announcements and updates" },
  { id: "frontend",      name: "# frontend",        icon: "⚛️", desc: "React, CSS, UI/UX discussions" },
  { id: "backend",       name: "# backend",         icon: "⚙️", desc: "API, DB, and server-side topics" },
  { id: "devops",        name: "# devops",           icon: "🚀", desc: "CI/CD, Docker, deployment pipeline" },
  { id: "skillsphere",   name: "# skillsphere-proj", icon: "🌐", desc: "Main SkillSphere platform project" },
];

const TEAM_MEMBERS = [
  { name: "Jane Doe",      role: "Full-Stack Eng",   status: "online",  avatar: "J" },
  { name: "Mark Smith",    role: "Product Manager",  status: "busy",    avatar: "M" },
  { name: "NeonCoder",     role: "UX Developer",     status: "online",  avatar: "N" },
  { name: "Sarah Jenkins", role: "DevOps",           status: "away",    avatar: "S" },
  { name: "You",           role: "Manager",          status: "online",  avatar: "Y" },
];

const SEED_MESSAGES = {
  general: [
    { id: 1, author: "Jane Doe",    avatar: "J", text: "Good morning team! 🚀 Sprint review at 3 PM today.", time: "09:02 AM", reactions: ["👍3", "🚀2"] },
    { id: 2, author: "Mark Smith",  avatar: "M", text: "Just pushed the dashboard hotfix. Please review PR #84.", time: "09:47 AM", reactions: ["✅1"] },
    { id: 3, author: "NeonCoder",   avatar: "N", text: "UI redesign mockups are up in Figma. Feedback welcome!", time: "10:15 AM", reactions: ["🔥4", "❤️2"] },
  ],
  frontend: [
    { id: 1, author: "NeonCoder",     avatar: "N", text: "Anyone else seeing hydration mismatches with React 19?", time: "11:00 AM", reactions: [] },
    { id: 2, author: "Jane Doe",      avatar: "J", text: "Yes! I fixed it by wrapping in Suspense. DM me if you need the snippet.", time: "11:08 AM", reactions: ["🙏2"] },
  ],
  backend: [
    { id: 1, author: "Sarah Jenkins", avatar: "S", text: "PostgreSQL connection pool maxed out during load test. Increasing to 50.", time: "10:30 AM", reactions: [] },
  ],
  devops: [
    { id: 1, author: "Sarah Jenkins", avatar: "S", text: "Pipeline #842 ✅ deployed to staging. Ready for QA sign-off.", time: "08:55 AM", reactions: ["🎉3"] },
  ],
  "skillsphere-proj": [
    { id: 1, author: "Mark Smith",  avatar: "M", text: "Milestone 3 complete! Next up: AI tutor integration 🤖", time: "Yesterday", reactions: ["🏆5", "🔥3"] },
    { id: 2, author: "NeonCoder",   avatar: "N", text: "Wireframes for the new student dashboard are done.", time: "Yesterday", reactions: ["👏2"] },
    { id: 3, author: "Jane Doe",    avatar: "J", text: "Backend APIs for leaderboard are merged. @NeonCoder ready to wire up?", time: "Today, 09:10 AM", reactions: [] },
  ],
};

const PROJECT_TASKS = [
  { id: 1, title: "Implement AI Tutor backend endpoint",  assignee: "Jane Doe",    priority: "High",   status: "In Progress", due: "Jul 25" },
  { id: 2, title: "Redesign leaderboard UI component",   assignee: "NeonCoder",   priority: "Medium", status: "Review",      due: "Jul 24" },
  { id: 3, title: "Set up Docker Compose for local dev", assignee: "Sarah Jenkins",priority: "High",   status: "Done",        due: "Jul 22" },
  { id: 4, title: "Write unit tests for auth module",    assignee: "Mark Smith",  priority: "Low",    status: "Todo",        due: "Jul 28" },
  { id: 5, title: "Deploy v2.1 to production",           assignee: "Sarah Jenkins",priority: "High",   status: "Todo",        due: "Jul 30" },
];

const STATUS_COLOR = { online: "#39ff14", busy: "#ff00c8", away: "#facc15", offline: "#64748b" };
const PRIORITY_COLOR = { High: "#ff00c8", Medium: "#facc15", Low: "#39ff14" };
const TASK_STATUS_COLOR = { "In Progress": "#00e5ff", "Review": "#facc15", "Done": "#39ff14", "Todo": "#64748b" };

export default function TeamSpace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeChannel, setActiveChannel] = useState("general");
  const [activeTab,     setActiveTab]     = useState("chat"); // chat | tasks | files
  const [messages,      setMessages]      = useState(SEED_MESSAGES);
  const [input,         setInput]         = useState("");
  const [tasks,         setTasks]         = useState(PROJECT_TASKS);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, activeChannel]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();
    const newMsg = {
      id: Date.now(), author: user?.full_name || user?.username || "You",
      avatar: (user?.full_name || user?.username || "Y").charAt(0).toUpperCase(),
      text, time: timeStr, reactions: [], isOwn: true
    };
    setMessages(prev => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), newMsg] }));
    setInput("");
  };

  const currentMessages = messages[activeChannel] || [];
  const channelInfo = INITIAL_CHANNELS.find(c => c.id === activeChannel);

  return (
    <div className="ts-root">
      <Background />
      <Navbar />

      <main className="ts-layout">

        {/* ── Left: Channel List ── */}
        <aside className="ts-sidebar">
          <div className="ts-sidebar-header">
            <div className="ts-workspace-logo">⬢</div>
            <div>
              <div className="ts-workspace-name">SkillSphere</div>
              <div className="ts-workspace-sub">Team Space</div>
            </div>
          </div>

          <div className="ts-section-label">Channels</div>
          {INITIAL_CHANNELS.map(ch => (
            <button
              key={ch.id}
              className={`ts-channel-btn ${activeChannel === ch.id ? "active" : ""}`}
              onClick={() => setActiveChannel(ch.id)}
            >
              <span className="ts-channel-icon">{ch.icon}</span>
              <span>{ch.name}</span>
            </button>
          ))}

          <div className="ts-section-label" style={{ marginTop: "20px" }}>Team Members</div>
          {TEAM_MEMBERS.map(m => (
            <div key={m.name} className="ts-member-row">
              <div className="ts-member-avatar" style={{ background: m.status === "online" ? "rgba(57,255,20,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${STATUS_COLOR[m.status]}30` }}>
                {m.avatar}
                <span className="ts-member-status-dot" style={{ background: STATUS_COLOR[m.status] }} />
              </div>
              <div>
                <div className="ts-member-name">{m.name}</div>
                <div className="ts-member-role">{m.role}</div>
              </div>
            </div>
          ))}
        </aside>

        {/* ── Main Content Area ── */}
        <section className="ts-main">

          {/* Channel Header */}
          <div className="ts-channel-header">
            <div>
              <h1 className="ts-channel-title">{channelInfo?.icon} {channelInfo?.name}</h1>
              <p className="ts-channel-desc">{channelInfo?.desc}</p>
            </div>
            <div className="ts-header-tabs">
              {["chat", "tasks", "files"].map(tab => (
                <button
                  key={tab}
                  className={`ts-tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "chat" ? "💬 Chat" : tab === "tasks" ? "✅ Tasks" : "📁 Files"}
                </button>
              ))}
            </div>
          </div>

          {/* ── Chat Tab ── */}
          {activeTab === "chat" && (
            <>
              <div className="ts-messages">
                {currentMessages.map(msg => (
                  <div key={msg.id} className={`ts-msg ${msg.isOwn ? "own" : ""}`}>
                    <div className="ts-msg-avatar">{msg.avatar}</div>
                    <div className="ts-msg-body">
                      <div className="ts-msg-meta">
                        <span className="ts-msg-author">{msg.author}</span>
                        <span className="ts-msg-time">{msg.time}</span>
                      </div>
                      <div className="ts-msg-text">{msg.text}</div>
                      {msg.reactions.length > 0 && (
                        <div className="ts-msg-reactions">
                          {msg.reactions.map(r => (
                            <span key={r} className="ts-reaction">{r}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="ts-input-bar">
                <input
                  className="ts-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                  placeholder={`Message ${channelInfo?.name || ""}…`}
                />
                <button className="ts-send-btn" onClick={sendMessage} disabled={!input.trim()}>Send ➤</button>
              </div>
            </>
          )}

          {/* ── Tasks Tab ── */}
          {activeTab === "tasks" && (
            <div className="ts-tasks-panel">
              <div className="ts-tasks-header">
                <h2 className="ts-tasks-title">🗂️ Project Board</h2>
                <div className="ts-tasks-stats">
                  <span style={{ color: "#39ff14" }}>{tasks.filter(t => t.status === "Done").length} Done</span>
                  <span style={{ color: "#00e5ff" }}>{tasks.filter(t => t.status === "In Progress").length} In Progress</span>
                  <span style={{ color: "#facc15" }}>{tasks.filter(t => t.status === "Review").length} In Review</span>
                  <span style={{ color: "#64748b" }}>{tasks.filter(t => t.status === "Todo").length} Todo</span>
                </div>
              </div>
              <div className="ts-tasks-list">
                {tasks.map(task => (
                  <div key={task.id} className="ts-task-card">
                    <div className="ts-task-left">
                      <span className="ts-task-status-dot" style={{ background: TASK_STATUS_COLOR[task.status] }} />
                      <div>
                        <div className="ts-task-title">{task.title}</div>
                        <div className="ts-task-meta">
                          Assigned: <strong>{task.assignee}</strong> · Due: {task.due}
                        </div>
                      </div>
                    </div>
                    <div className="ts-task-right">
                      <span className="ts-task-priority" style={{ color: PRIORITY_COLOR[task.priority], borderColor: PRIORITY_COLOR[task.priority] + "40", background: PRIORITY_COLOR[task.priority] + "12" }}>
                        {task.priority}
                      </span>
                      <span className="ts-task-status-badge" style={{ color: TASK_STATUS_COLOR[task.status], borderColor: TASK_STATUS_COLOR[task.status] + "40", background: TASK_STATUS_COLOR[task.status] + "12" }}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Files Tab ── */}
          {activeTab === "files" && (
            <div className="ts-files-panel">
              <h2 className="ts-tasks-title" style={{ marginBottom: "20px" }}>📁 Shared Files</h2>
              {[
                { name: "SkillSphere_Architecture_v3.pdf",     size: "2.4 MB", type: "PDF",  uploader: "Mark Smith",    time: "Jul 21" },
                { name: "Dashboard_Wireframes_Final.fig",       size: "8.1 MB", type: "FIG",  uploader: "NeonCoder",     time: "Jul 21" },
                { name: "Sprint_5_Velocity_Report.xlsx",        size: "540 KB", type: "XLSX", uploader: "Mark Smith",    time: "Jul 20" },
                { name: "docker-compose.prod.yml",              size: "3.2 KB", type: "YML",  uploader: "Sarah Jenkins", time: "Jul 19" },
                { name: "AI_Tutor_API_Spec.md",                 size: "21 KB",  type: "MD",   uploader: "Jane Doe",      time: "Jul 18" },
              ].map(f => (
                <div key={f.name} className="ts-file-card">
                  <div className="ts-file-icon">{f.type === "PDF" ? "📄" : f.type === "FIG" ? "🎨" : f.type === "XLSX" ? "📊" : f.type === "YML" ? "⚙️" : "📝"}</div>
                  <div className="ts-file-info">
                    <div className="ts-file-name">{f.name}</div>
                    <div className="ts-file-meta">{f.size} · uploaded by {f.uploader} · {f.time}</div>
                  </div>
                  <button className="ts-file-download">⬇ Download</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

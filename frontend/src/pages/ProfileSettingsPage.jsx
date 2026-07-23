import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Background from "../components/Background";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";
import { FiSave, FiUser, FiGlobe, FiBriefcase, FiCheck, FiSun, FiMoon } from "react-icons/fi";

// ─── Accent palette ────────────────────────────────────────────────────────
const ACCENTS = [
  { label: "Cyber Cyan",      color: "#00e5ff" },
  { label: "Electric Purple", color: "#8a2eff" },
  { label: "Neon Pink",       color: "#ff00c8" },
  { label: "Neon Green",      color: "#22c55e" },
  { label: "Gold Amber",      color: "#facc15" },
  { label: "Fire Orange",     color: "#f97316" },
  { label: "Ice Blue",        color: "#38bdf8" },
  { label: "Rose Red",        color: "#f43f5e" },
];

export default function ProfileSettingsPage() {
  const { user, updateUserProfile, themeMode, themeAccent, updateTheme, completedTopics } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab]         = useState("profile");
  const [toastMsg, setToastMsg]           = useState("");
  const [toastType, setToastType]         = useState("success");

  // ── Profile fields ─────────────────────────────────────────────────────
  const [fullName,  setFullName]   = useState("");
  const [title,     setTitle]      = useState("");
  const [bio,       setBio]        = useState("");
  const [email,     setEmail]      = useState("");
  const [phone,     setPhone]      = useState("");
  const [location,  setLocation]   = useState("");
  const [github,    setGithub]     = useState("");
  const [linkedin,  setLinkedin]   = useState("");
  const [portfolio, setPortfolio]  = useState("");
  const [skills,    setSkills]     = useState("");

  // ── Theme selections (LOCAL — only committed on Save) ──────────────────
  const [selectedMode,   setSelectedMode]   = useState(themeMode   || "dark");
  const [selectedAccent, setSelectedAccent] = useState(themeAccent || "#00e5ff");

  // Load profile from user context once
  useEffect(() => {
    if (!user) return;
    setFullName(user.full_name || "");
    setTitle(user.title || (user.role === "EMPLOYEE" ? "Workforce Manager" : "Software Engineering Student"));
    setBio(user.bio || "");
    setEmail(user.contact_email || user.email || "");
    setPhone(user.phone || "");
    setLocation(user.location || "");
    setGithub(user.github || "");
    setLinkedin(user.linkedin || "");
    setPortfolio(user.portfolio || "");
    setSkills(user.skills || "React, JavaScript, Java");
  }, [user?.email]); // only run when the user identity changes

  // Sync theme selectors if theme changes externally
  useEffect(() => {
    setSelectedMode(themeMode);
    setSelectedAccent(themeAccent);
  }, [themeMode, themeAccent]);

  // Cleanup theme preview on unmount to prevent unsaved previews from sticking
  useEffect(() => {
    return () => {
      const root = document.documentElement;
      root.setAttribute("data-theme", themeMode);
      const vars = themeMode === "light" ? {
        "--bg-primary":     "#f0f4f8",
        "--bg-secondary":   "#e2e8f0",
        "--bg-panel":       "rgba(255,255,255,0.95)",
        "--bg-card":        "rgba(248,250,252,0.98)",
        "--text-primary":   "#0f172a",
        "--text-secondary": "#475569",
        "--text-muted":     "#94a3b8",
        "--border-color":   "rgba(0,0,0,0.12)",
        "--border-subtle":  "rgba(0,0,0,0.05)",
        "--navbar-bg":      "rgba(240,244,248,0.92)",
        "--input-bg":       "rgba(255,255,255,0.9)",
        "--shadow-panel":   "0 10px 35px rgba(0,0,0,0.12)",
      } : {
        "--bg-primary":     "#05060b",
        "--bg-secondary":   "#0a0e1e",
        "--bg-panel":       "rgba(15,23,42,0.85)",
        "--bg-card":        "rgba(10,14,30,0.9)",
        "--text-primary":   "#ffffff",
        "--text-secondary": "#94a3b8",
        "--text-muted":     "#475569",
        "--border-color":   "rgba(255,255,255,0.08)",
        "--border-subtle":  "rgba(255,255,255,0.04)",
        "--navbar-bg":      "rgba(12,12,16,0.75)",
        "--input-bg":       "rgba(0,0,0,0.5)",
        "--shadow-panel":   "0 10px 35px rgba(0,0,0,0.5)",
      };
      Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
      root.style.setProperty("--accent", themeAccent);
    };
  }, [themeMode, themeAccent]);

  // Toast helper
  const showToast = useCallback((msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(""), 4000);
  }, []);

  // ── Save profile ────────────────────────────────────────────────────────
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast("⚠️ Full Name cannot be empty!", "error");
      return;
    }
    updateUserProfile({
      full_name:     fullName.trim(),
      title:         title.trim(),
      bio:           bio.trim(),
      contact_email: email.trim(),
      phone:         phone.trim(),
      location:      location.trim(),
      github:        github.trim(),
      linkedin:      linkedin.trim(),
      portfolio:     portfolio.trim(),
      skills:        skills.trim(),
    });
    showToast("✅ Profile updated successfully!");
  };

  // ── Save theme (commit to context + localStorage) ───────────────────────
  const handleSaveTheme = () => {
    updateTheme({ mode: selectedMode, accent: selectedAccent });
    showToast("🎨 Theme applied and saved!");
  };

  // ── Preview theme live (without committing to context) ──────────────────
  // Apply directly to document.documentElement for instant preview
  const previewTheme = (mode, accent) => {
    const vars = mode === "light" ? {
      "--bg-primary":     "#f0f4f8",
      "--bg-secondary":   "#e2e8f0",
      "--bg-panel":       "rgba(255,255,255,0.95)",
      "--bg-card":        "rgba(248,250,252,0.98)",
      "--text-primary":   "#0f172a",
      "--text-secondary": "#475569",
      "--text-muted":     "#94a3b8",
      "--border-color":   "rgba(0,0,0,0.12)",
      "--border-subtle":  "rgba(0,0,0,0.05)",
      "--navbar-bg":      "rgba(240,244,248,0.92)",
      "--input-bg":       "rgba(255,255,255,0.9)",
      "--shadow-panel":   "0 10px 35px rgba(0,0,0,0.12)",
    } : {
      "--bg-primary":     "#05060b",
      "--bg-secondary":   "#0a0e1e",
      "--bg-panel":       "rgba(15,23,42,0.85)",
      "--bg-card":        "rgba(10,14,30,0.9)",
      "--text-primary":   "#ffffff",
      "--text-secondary": "#94a3b8",
      "--text-muted":     "#475569",
      "--border-color":   "rgba(255,255,255,0.08)",
      "--border-subtle":  "rgba(255,255,255,0.04)",
      "--navbar-bg":      "rgba(12,12,16,0.75)",
      "--input-bg":       "rgba(0,0,0,0.5)",
      "--shadow-panel":   "0 10px 35px rgba(0,0,0,0.5)",
    };
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.style.setProperty("--accent", accent);
    root.setAttribute("data-theme", mode);
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    previewTheme(mode, selectedAccent);
  };

  const handleAccentChange = (accent) => {
    setSelectedAccent(accent);
    previewTheme(selectedMode, accent);
  };

  // ── Derived values ──────────────────────────────────────────────────────
  const isDark    = selectedMode === "dark";
  const isStudent = user?.role === "STUDENT";
  const accent    = selectedAccent;

  const panel = {
    background: "var(--bg-panel)",
    border:     `1px solid ${"var(--border-color)"}`,
    color:      "var(--text-primary)",
    boxShadow:  isDark ? "0 10px 35px rgba(0,0,0,0.5)" : "0 10px 35px rgba(0,0,0,0.1)",
  };

  const inputStyle = {
    width:        "100%",
    background:   "var(--input-bg)",
    border:       `1px solid ${"var(--border-color)"}`,
    color:        "var(--text-primary)",
    padding:      "10px 14px",
    borderRadius: "8px",
    fontSize:     "14px",
    outline:      "none",
    fontFamily:   "inherit",
    boxSizing:    "border-box",
  };

  const labelStyle = {
    display:      "block",
    color:        "var(--text-secondary)",
    fontSize:     "13px",
    marginBottom: "6px",
    fontWeight:   "700",
  };

  const sectionHeadStyle = {
    display:       "flex",
    alignItems:    "center",
    gap:           "10px",
    marginBottom:  "22px",
    paddingBottom: "14px",
    borderBottom:  `1px solid ${"var(--border-subtle)"}`,
  };

  return (
    <div
      className={`dashboard-page ${isSidebarOpen && isStudent ? "with-sidebar" : ""}`}
      style={{ minHeight: "100vh", color: "var(--text-primary)", transition: "background 0.3s, color 0.3s" }}
    >
      <Background />
      <Navbar
        toggleSidebar={() => setIsSidebarOpen(s => !s)}
        isSidebarOpen={isSidebarOpen}
        showSidebarToggle={isStudent}
      />
      {isStudent && (
        <DashboardSidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(s => !s)}
        />
      )}

      {/* ── Toast notification ────────────────────────────────────────── */}
      {toastMsg && (
        <div style={{
          position:     "fixed",
          top:          "92px",
          right:        "25px",
          zIndex:       99999,
          background:   toastType === "error"
                          ? "linear-gradient(135deg,#ef4444,#dc2626)"
                          : `linear-gradient(135deg,${accent},#8a2eff)`,
          color:        "var(--text-primary)",
          padding:      "14px 24px",
          borderRadius: "14px",
          boxShadow:    `0 10px 30px ${accent}50`,
          fontWeight:   "700",
          fontSize:     "15px",
          animation:    "fadeIn 0.3s ease",
        }}>
          {toastMsg}
        </div>
      )}

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "110px 24px 60px", position: "relative", zIndex: 10 }}>

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{
            fontFamily:            "Orbitron, sans-serif",
            fontSize:              "28px",
            background:            `linear-gradient(90deg, ${accent}, #8a2eff)`,
            WebkitBackgroundClip:  "text",
            WebkitTextFillColor:   "transparent",
            marginBottom:          "6px",
          }}>
            ⚙️ Profile Settings
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>
            Manage your personal info, social links, and skills.
          </p>
        </div>

        {/* ── Tab bar ───────────────────────────────────────────────────── */}
        <div style={{
          display:       "flex",
          gap:           "4px",
          marginBottom:  "28px",
          borderBottom:  `2px solid ${"var(--border-subtle)"}`,
        }}>
          {[
            { id: "profile", label: "👤 Profile Info" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding:      "11px 22px",
                background:   "transparent",
                border:       "none",
                borderBottom: activeTab === tab.id ? `3px solid ${accent}` : "3px solid transparent",
                color:        activeTab === tab.id ? accent : ("var(--text-muted)"),
                fontWeight:   "700",
                fontSize:     "14px",
                cursor:       "pointer",
                fontFamily:   "Orbitron, sans-serif",
                transition:   "all 0.2s",
                marginBottom: "-2px",
                letterSpacing: "0.3px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════════════ PROFILE TAB ════════════════════════════ */}
        {activeTab === "profile" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start" }}>

            {/* Left — edit form */}
            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Personal Info */}
              <div style={{ ...panel, borderRadius: "16px", padding: "26px" }}>
                <div style={sectionHeadStyle}>
                  <FiUser size={18} style={{ color: accent }} />
                  <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "15px", color: "var(--text-primary)", margin: 0 }}>
                    Personal Info
                  </h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input required value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} placeholder="Your full name" />
                  </div>
                  <div>
                    <label style={labelStyle}>Job Title / Headline</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} placeholder="e.g. Full Stack Developer" />
                  </div>
                  <div>
                    <label style={labelStyle}>Contact Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="your@email.com" />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Location</label>
                    <input value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} placeholder="City, Country" />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Bio / About Me</label>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      style={{ ...inputStyle, resize: "vertical" }}
                      placeholder="Write a short description about yourself..."
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div style={{ ...panel, borderRadius: "16px", padding: "26px" }}>
                <div style={sectionHeadStyle}>
                  <FiGlobe size={18} style={{ color: accent }} />
                  <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "15px", color: "var(--text-primary)", margin: 0 }}>
                    Social & Links
                  </h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>🔗 GitHub URL</label>
                    <input type="url" value={github} onChange={e => setGithub(e.target.value)} style={inputStyle} placeholder="https://github.com/username" />
                  </div>
                  <div>
                    <label style={labelStyle}>🔗 LinkedIn URL</label>
                    <input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} style={inputStyle} placeholder="https://linkedin.com/in/username" />
                  </div>
                  <div>
                    <label style={labelStyle}>🌐 Portfolio / Website</label>
                    <input type="url" value={portfolio} onChange={e => setPortfolio(e.target.value)} style={inputStyle} placeholder="https://yourportfolio.dev" />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div style={{ ...panel, borderRadius: "16px", padding: "26px" }}>
                <div style={sectionHeadStyle}>
                  <FiBriefcase size={18} style={{ color: accent }} />
                  <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "15px", color: "var(--text-primary)", margin: 0 }}>
                    Technical Skills
                  </h3>
                </div>
                <label style={labelStyle}>Skills (comma separated)</label>
                <input
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  style={inputStyle}
                  placeholder="React, Java, Spring Boot, MySQL, Docker"
                />
                {skills && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                    {skills.split(",").map((s, i) => s.trim() && (
                      <span key={i} style={{
                        background:   `${accent}18`,
                        border:       `1px solid ${accent}40`,
                        color:        accent,
                        padding:      "4px 12px",
                        borderRadius: "20px",
                        fontSize:     "12px",
                        fontWeight:   "700",
                      }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Save */}
              <button
                type="submit"
                style={{
                  background:    `linear-gradient(90deg, ${accent}, #8a2eff)`,
                  color:         "var(--text-primary)",
                  border:        "none",
                  padding:       "14px 30px",
                  borderRadius:  "12px",
                  fontSize:      "15px",
                  fontWeight:    "700",
                  cursor:        "pointer",
                  fontFamily:    "Orbitron, sans-serif",
                  boxShadow:     `0 0 20px ${accent}40`,
                  display:       "flex",
                  alignItems:    "center",
                  justifyContent: "center",
                  gap:           "8px",
                  letterSpacing: "0.4px",
                }}
              >
                <FiSave size={17} />
                Save Profile Changes
              </button>
            </form>

            {/* Right — live preview card */}
            <div style={{
              ...panel,
              borderRadius:  "20px",
              padding:       "28px",
              textAlign:     "center",
              position:      "sticky",
              top:           "110px",
              border:        `2px solid ${accent}50`,
              boxShadow:     `0 0 30px ${accent}20`,
              overflow:      "hidden",
            }}>
              {/* Banner gradient */}
              <div style={{
                position:   "absolute",
                top: 0, left: 0, right: 0,
                height:     "80px",
                background: `linear-gradient(135deg, ${accent}30, transparent)`,
              }} />

              <div style={{ position: "relative", zIndex: 2, marginTop: "10px" }}>
                {/* Avatar */}
                <div style={{
                  width:         "82px",
                  height:        "82px",
                  borderRadius:  "50%",
                  background:    `linear-gradient(135deg, ${accent}, #8a2eff)`,
                  color:         "var(--text-primary)",
                  fontSize:      "28px",
                  fontWeight:    "800",
                  display:       "flex",
                  alignItems:    "center",
                  justifyContent:"center",
                  margin:        "0 auto 14px",
                  boxShadow:     `0 0 22px ${accent}60`,
                  border:        `3px solid ${"var(--bg-primary)"}`,
                }}>
                  {(fullName || user?.username || "U").charAt(0).toUpperCase()}
                </div>

                <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "18px", color: "var(--text-primary)", margin: "0 0 4px" }}>
                  {fullName || "Your Name"}
                </h3>
                <div style={{ fontSize: "11px", color: accent, fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Orbitron, sans-serif", marginBottom: "4px" }}>
                  {user?.role || "ROLE"}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                  {title || "Your title here"}
                </div>
                {location && (
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                    📍 {location}
                  </div>
                )}
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6", margin: "10px 0", minHeight: "44px" }}>
                  {bio || "Your bio will appear here..."}
                </p>

                {/* Skill tags */}
                {skills && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center", margin: "10px 0" }}>
                    {skills.split(",").slice(0, 5).map((s, i) => s.trim() && (
                      <span key={i} style={{
                        background:   "var(--bg-secondary)",
                        border:       `1px solid ${"var(--border-color)"}`,
                        color:        "var(--text-secondary)",
                        padding:      "3px 9px",
                        borderRadius: "12px",
                        fontSize:     "11px",
                        fontWeight:   "600",
                      }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social links */}
                <div style={{
                  display:       "flex",
                  gap:           "12px",
                  justifyContent:"center",
                  borderTop:     `1px solid ${"var(--border-subtle)"}`,
                  paddingTop:    "12px",
                  marginTop:     "12px",
                  flexWrap:      "wrap",
                }}>
                  {github    && <a href={github}    target="_blank" rel="noreferrer" style={{ color: accent, textDecoration: "none", fontSize: "12px", fontWeight: "700" }}>GitHub ↗</a>}
                  {linkedin  && <a href={linkedin}  target="_blank" rel="noreferrer" style={{ color: accent, textDecoration: "none", fontSize: "12px", fontWeight: "700" }}>LinkedIn ↗</a>}
                  {portfolio && <a href={portfolio} target="_blank" rel="noreferrer" style={{ color: accent, textDecoration: "none", fontSize: "12px", fontWeight: "700" }}>Portfolio ↗</a>}
                  {!github && !linkedin && !portfolio && (
                    <span style={{ color: isDark ? "#334155" : "var(--text-secondary)", fontSize: "12px" }}>No social links yet</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* certificates tab removed */}
        {activeTab === "__removed__" && (() => {
          const CERTS = [
            { id: "CERT-REACT-8942",  title: "React Web Architecture & Masterclass",    courseName: "React Developer",      trackKey: "react",      color: "#00e5ff", date: "2026-07-15", topics: ["Hooks","Context","Routing","State Mgmt","Performance","Testing"] },
            { id: "CERT-JAVA-3310",   title: "Core Java OOPs & Enterprise Systems",      courseName: "Java Master",           trackKey: "java",       color: "#f97316", date: "2026-07-18", topics: ["OOP","Collections","Streams","Generics","Concurrency","JVM"] },
            { id: "CERT-SPRING-7721", title: "Spring Boot Microservices & Security",      courseName: "Spring Boot Pro",       trackKey: "springboot", color: "#22c55e", date: "2026-07-20", topics: ["REST APIs","JPA","Security","Microservices","Docker","Testing"] },
            { id: "CERT-DSA-4401",   title: "Data Structures & Algorithms Pro",          courseName: "DSA Expert",            trackKey: "dsa",        color: "#8a2eff", date: "2026-07-21", topics: ["Arrays","Trees","Graphs","DP","Sorting","Greedy"] },
            { id: "CERT-JS-5541",    title: "Modern JavaScript Ninja & ES6+",           courseName: "JavaScript",            trackKey: "javascript", color: "#facc15", date: "2026-07-21", topics: ["Closures","Promises","Async","DOM","Modules","TypeScript"] },
            { id: "CERT-GENAI-9901", title: "Generative AI & Prompt Engineering",        courseName: "GenAI",                 trackKey: "genai",      color: "#ff00c8", date: "2026-07-22", topics: ["LLMs","Prompting","RAG","Fine-tuning","Agents","Ethics"] },
          ];

          const earnedCount = CERTS.filter(c =>
            (completedTopics || []).filter(id => id.startsWith(`${c.trackKey}_`)).length >= 6
          ).length;

          return (
            <div>
              {/* Header stats bar */}
              <div style={{
                ...panel,
                borderRadius:   "16px",
                padding:        "20px 28px",
                marginBottom:   "24px",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                flexWrap:       "wrap",
                gap:            "16px",
                border:         `1px solid ${accent}30`,
                boxShadow:      `0 0 24px ${accent}15`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    background: `linear-gradient(135deg, ${accent}, #8a2eff)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "22px", boxShadow: `0 0 16px ${accent}50`,
                  }}>🏆</div>
                  <div>
                    <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "18px", color: "var(--text-primary)", fontWeight: "800" }}>
                      {earnedCount} / {CERTS.length} Certificates Earned
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Complete all 6 modules in a course to unlock its certificate
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ minWidth: "200px", flex: 1, maxWidth: "300px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "Orbitron, sans-serif" }}>PROGRESS</span>
                    <span style={{ fontSize: "11px", color: accent, fontFamily: "Orbitron, sans-serif", fontWeight: "700" }}>{Math.round((earnedCount / CERTS.length) * 100)}%</span>
                  </div>
                  <div style={{ height: "8px", background: "var(--border-color)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(earnedCount / CERTS.length) * 100}%`, background: `linear-gradient(90deg, ${accent}, #8a2eff)`, borderRadius: "4px", transition: "width 0.6s ease", boxShadow: `0 0 8px ${accent}60` }} />
                  </div>
                </div>
              </div>

              {/* Certificate cards grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
                {CERTS.map(cert => {
                  const done = (completedTopics || []).filter(id => id.startsWith(`${cert.trackKey}_`)).length;
                  const isEarned = done >= 6;
                  const dateFormatted = new Date(cert.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

                  return (
                    <div key={cert.id} style={{
                      ...panel,
                      borderRadius:  "16px",
                      padding:       "0",
                      border:        isEarned ? `1px solid ${cert.color}50` : `1px solid ${"var(--border-subtle)"}`,
                      overflow:      "hidden",
                      opacity:       isEarned ? 1 : 0.65,
                      transition:    "all 0.3s",
                      boxShadow:     isEarned ? `0 0 24px ${cert.color}20` : "none",
                      position:      "relative",
                    }}>

                      {/* Colored top banner */}
                      <div style={{
                        background:  isEarned
                          ? `linear-gradient(135deg, ${cert.color}30 0%, ${isDark ? "var(--bg-secondary)" : "#e2e8f0"} 100%)`
                          : ("var(--bg-secondary)"),
                        padding:     "18px 20px 14px",
                        borderBottom:`1px solid ${isEarned ? cert.color + "20" : ("var(--bg-secondary)")}`,
                        display:     "flex",
                        alignItems:  "center",
                        gap:         "14px",
                      }}>
                        {/* Icon */}
                        <div style={{
                          width: "48px", height: "48px", borderRadius: "12px", flexShrink: 0,
                          background: isEarned ? `linear-gradient(135deg, ${cert.color}30, ${cert.color}10)` : ("var(--bg-secondary)"),
                          border: `2px solid ${isEarned ? cert.color + "60" : ("var(--border-color)")}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "22px",
                          boxShadow: isEarned ? `0 0 12px ${cert.color}40` : "none",
                        }}>
                          {isEarned ? "🎓" : "🔒"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "14px", fontWeight: "700", color: (isEarned ? "var(--text-primary)" : "var(--text-muted)"), lineHeight: "1.4", marginBottom: "4px" }}>
                            {cert.title}
                          </div>
                          <div style={{ fontSize: "11px", color: isEarned ? cert.color : ("var(--text-muted)"), fontFamily: "Orbitron, sans-serif", fontWeight: "700" }}>
                            {cert.courseName}
                          </div>
                        </div>
                        {/* VALID / LOCKED badge */}
                        {isEarned ? (
                          <div style={{
                            background: cert.color, color: "var(--bg-primary)",
                            fontSize: "9px", fontWeight: "900",
                            padding: "4px 10px", borderRadius: "20px",
                            fontFamily: "Orbitron, sans-serif", letterSpacing: "1px",
                            boxShadow: `0 0 10px ${cert.color}80`, flexShrink: 0,
                          }}>✓ VALID</div>
                        ) : (
                          <div style={{
                            background: "var(--border-color)",
                            color: "var(--text-muted)",
                            fontSize: "9px", fontWeight: "900",
                            padding: "4px 10px", borderRadius: "20px",
                            fontFamily: "Orbitron, sans-serif", letterSpacing: "1px", flexShrink: 0,
                          }}>🔒 LOCKED</div>
                        )}
                      </div>

                      {/* Card body */}
                      <div style={{ padding: "16px 20px" }}>
                        {isEarned ? (
                          <>
                            {/* Issue date */}
                            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                              📅 Issued: <strong style={{ color: "var(--text-secondary)" }}>{dateFormatted}</strong>
                            </div>
                            {/* Verification ID */}
                            <div style={{
                              fontSize: "11px", fontFamily: "Orbitron, sans-serif",
                              color: cert.color, fontWeight: "700", letterSpacing: "1px",
                              marginBottom: "14px",
                            }}>
                              VERIFICATION: {cert.id}
                            </div>
                            {/* Module topics */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                              {cert.topics.map(t => (
                                <span key={t} style={{
                                  background: `${cert.color}15`, border: `1px solid ${cert.color}30`,
                                  color: cert.color, padding: "3px 9px",
                                  borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                                }}>{t}</span>
                              ))}
                            </div>
                            {/* View Certificate button */}
                            <button
                              type="button"
                              onClick={() => window.location.href = "/certificate"}
                              style={{
                                width: "100%",
                                background: `linear-gradient(90deg, ${cert.color}20, ${cert.color}08)`,
                                border: `1px solid ${cert.color}`,
                                color: cert.color,
                                padding: "9px 16px",
                                borderRadius: "10px",
                                fontSize: "13px",
                                fontWeight: "700",
                                cursor: "pointer",
                                fontFamily: "Orbitron, sans-serif",
                                letterSpacing: "0.5px",
                                boxShadow: `0 0 10px ${cert.color}30`,
                                transition: "all 0.2s",
                              }}
                            >
                              View Certificate →
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Progress bar */}
                            <div style={{ marginBottom: "10px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Modules Completed</span>
                                <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "700" }}>{done} / 6</span>
                              </div>
                              <div style={{ height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${(done / 6) * 100}%`, background: cert.color, borderRadius: "3px", transition: "width 0.5s" }} />
                              </div>
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px" }}>
                              Complete {6 - done} more module{6 - done !== 1 ? "s" : ""} to unlock this certificate
                            </div>
                            {/* Module topics */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              {cert.topics.map((t, i) => (
                                <span key={t} style={{
                                  background: i < done ? `${cert.color}15` : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"),
                                  border: i < done ? `1px solid ${cert.color}30` : `1px solid ${"var(--border-subtle)"}`,
                                  color: i < done ? cert.color : (isDark ? "#334155" : "var(--text-secondary)"),
                                  padding: "3px 9px",
                                  borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                                  textDecoration: i < done ? "none" : "none",
                                }}>{i < done ? "✓" : ""} {t}</span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </main>

      <Footer />
    </div>
  );
}

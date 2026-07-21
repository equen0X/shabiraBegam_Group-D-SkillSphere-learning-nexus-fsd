import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Background from "../components/Background";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
const TODAY = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD" — recomputed at module load each day

const COURSES = [
  { id: "react",      label: "React",       prefix: "react_",      color: "#00e5ff", totalTopics: 6 },
  { id: "java",       label: "Java",         prefix: "java_",       color: "#f97316", totalTopics: 6 },
  { id: "springboot", label: "Spring Boot",  prefix: "springboot_", color: "#22c55e", totalTopics: 6 },
  { id: "dsa",        label: "DSA",          prefix: "dsa_",        color: "#8a2eff", totalTopics: 6 },
  { id: "genai",      label: "GenAI",        prefix: "genai_",      color: "#ff00c8", totalTopics: 6 },
  { id: "javascript", label: "JavaScript",   prefix: "javascript_", color: "#facc15", totalTopics: 6 },
];

/** Return the last N calendar dates as "YYYY-MM-DD" strings, newest last */
function getLastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

/** Friendly label for a date string */
function dayLabel(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today - d) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Load the day-wise snapshot log from localStorage */
function loadProgressLog() {
  try {
    return JSON.parse(localStorage.getItem("progress_log") || "{}");
  } catch {
    return {};
  }
}

/** Save snapshot for today */
function saveProgressSnapshot(completedTopics) {
  const log = loadProgressLog();
  const snapshot = {};
  COURSES.forEach(c => {
    snapshot[c.id] = (completedTopics || []).filter(t => t.startsWith(c.prefix)).length;
  });
  log[TODAY] = snapshot;
  localStorage.setItem("progress_log", JSON.stringify(log));
}

export default function ProgressPage() {
  const { user, completedTopics } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [range, setRange] = useState(7); // days to show: 7 or 14

  // Persist today's snapshot whenever completedTopics changes
  useEffect(() => {
    saveProgressSnapshot(completedTopics);
  }, [completedTopics]);

  // Build current course data
  const currentData = COURSES.map(c => ({
    ...c,
    completed: (completedTopics || []).filter(t => t.startsWith(c.prefix)).length,
    pct: Math.round(((completedTopics || []).filter(t => t.startsWith(c.prefix)).length / c.totalTopics) * 100),
  }));

  const overallPct = Math.round(
    currentData.reduce((s, c) => s + c.pct, 0) / currentData.length
  );

  // Build day-wise chart data
  const days = getLastNDays(range);
  const progressLog = loadProgressLog();

  // For each day get overall %
  const chartData = days.map(day => {
    const snap = progressLog[day];
    if (!snap) return { day, overall: 0 };
    const totals = COURSES.map(c => Math.round(((snap[c.id] || 0) / c.totalTopics) * 100));
    const avg = Math.round(totals.reduce((s, v) => s + v, 0) / totals.length);
    return { day, overall: avg, snap };
  });

  const maxVal = Math.max(...chartData.map(d => d.overall), 10); // min scale 10 for empty

  return (
    <div className={`dashboard-page ${isSidebarOpen ? 'with-sidebar' : ''}`}>
      <Background />
      <Navbar
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        showSidebarToggle={true}
      />
      <DashboardSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main className="dashboard-content-wrapper" style={{ paddingTop: '120px', paddingBottom: '60px' }}>

        {/* Page Header */}
        <section style={{ marginBottom: '35px' }}>
          <h1 style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '34px',
            background: 'linear-gradient(90deg, #00e5ff, #8a2eff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            📊 Learning Progress
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Day-by-day tracking of your skill completion across all course tracks.
          </p>
        </section>

        {/* Top stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '35px' }}>
          {/* Overall */}
          <div style={{
            background: 'rgba(0, 229, 255, 0.06)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 0 20px rgba(0,229,255,0.1)'
          }}>
            <div style={{ fontSize: '48px', fontFamily: 'Orbitron, sans-serif', color: '#00e5ff', fontWeight: '900', lineHeight: 1 }}>
              {overallPct}%
            </div>
            <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Overall Progress
            </div>
          </div>

          {/* Courses done */}
          <div style={{
            background: 'rgba(138, 46, 255, 0.06)',
            border: '1px solid rgba(138, 46, 255, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', fontFamily: 'Orbitron, sans-serif', color: '#8a2eff', fontWeight: '900', lineHeight: 1 }}>
              {currentData.filter(c => c.pct >= 100).length}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Courses Completed
            </div>
          </div>

          {/* Topics done */}
          <div style={{
            background: 'rgba(255, 0, 200, 0.06)',
            border: '1px solid rgba(255, 0, 200, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', fontFamily: 'Orbitron, sans-serif', color: '#ff00c8', fontWeight: '900', lineHeight: 1 }}>
              {currentData.reduce((s, c) => s + c.completed, 0)}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Topics Completed
            </div>
          </div>

          {/* Total available */}
          <div style={{
            background: 'rgba(250, 204, 21, 0.06)',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', fontFamily: 'Orbitron, sans-serif', color: '#facc15', fontWeight: '900', lineHeight: 1 }}>
              {COURSES.reduce((s, c) => s + c.totalTopics, 0)}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Total Topics
            </div>
          </div>
        </div>

        {/* Day-wise Bar Chart */}
        <div style={{
          background: 'rgba(10, 14, 30, 0.9)',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '35px',
          boxShadow: '0 0 30px rgba(0,229,255,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', color: '#ffffff', margin: 0 }}>
                Overall Progress — Day by Day
              </h2>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0 0' }}>
                Each bar shows your average skill completion % for that day
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[7, 14].map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '20px',
                    border: range === r ? '1px solid #00e5ff' : '1px solid rgba(255,255,255,0.1)',
                    background: range === r ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.04)',
                    color: range === r ? '#00e5ff' : '#64748b',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '13px',
                    transition: 'all 0.2s'
                  }}
                >
                  {r}D
                </button>
              ))}
            </div>
          </div>

          {/* Y-axis labels + bars */}
          <div style={{ display: 'flex', gap: '0', alignItems: 'flex-end', position: 'relative' }}>
            {/* Y-axis */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '220px', marginRight: '12px', paddingBottom: '30px' }}>
              {[100, 75, 50, 25, 0].map(v => (
                <span key={v} style={{ fontSize: '11px', color: '#475569', fontWeight: '600', textAlign: 'right', lineHeight: 1 }}>
                  {v}%
                </span>
              ))}
            </div>

            {/* Grid + bars */}
            <div style={{ flex: 1, position: 'relative' }}>
              {/* Horizontal grid lines */}
              {[0, 25, 50, 75, 100].map((v, i) => (
                <div key={v} style={{
                  position: 'absolute',
                  left: 0, right: 0,
                  bottom: `calc(30px + ${(v / 100) * 190}px)`,
                  borderTop: `1px dashed rgba(255,255,255,${i === 0 ? '0.15' : '0.05'})`,
                  zIndex: 0
                }} />
              ))}

              {/* Bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '220px', gap: '6px', paddingBottom: '30px', position: 'relative', zIndex: 1 }}>
                {chartData.map((d) => {
                  const barH = d.overall > 0 ? Math.max(4, Math.round((d.overall / 100) * 190)) : 4;
                  const isToday = d.day === TODAY;
                  return (
                    <div
                      key={d.day}
                      title={`${dayLabel(d.day)}: ${d.overall}%`}
                      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'default' }}
                    >
                      {/* Percent label on bar */}
                      {d.overall > 0 && (
                        <span style={{ fontSize: '10px', color: isToday ? '#00e5ff' : '#64748b', fontWeight: '700' }}>
                          {d.overall}%
                        </span>
                      )}

                      {/* Bar */}
                      <div style={{
                        width: '100%',
                        height: `${barH}px`,
                        background: isToday
                          ? 'linear-gradient(180deg, #00e5ff, #8a2eff)'
                          : 'linear-gradient(180deg, rgba(0,229,255,0.5), rgba(138,46,255,0.3))',
                        borderRadius: '6px 6px 2px 2px',
                        boxShadow: isToday ? '0 0 14px rgba(0,229,255,0.5)' : 'none',
                        transition: 'height 0.5s ease',
                        position: 'relative',
                        border: isToday ? '1px solid #00e5ff' : '1px solid rgba(0,229,255,0.15)'
                      }} />

                      {/* Day label */}
                      <span style={{
                        fontSize: range > 7 ? '9px' : '11px',
                        color: isToday ? '#00e5ff' : '#475569',
                        fontWeight: isToday ? '700' : '500',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%'
                      }}>
                        {dayLabel(d.day)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Per-course progress bars */}
        <div style={{
          background: 'rgba(10, 14, 30, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '35px'
        }}>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', color: '#ffffff', marginBottom: '25px' }}>
            Per-Course Breakdown
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {currentData.map(c => (
              <div key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px' }}>{c.label}</span>
                    <span style={{ color: '#475569', fontSize: '12px', marginLeft: '10px' }}>
                      {c.completed} / {c.totalTopics} topics completed
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: '800',
                    fontSize: '16px',
                    color: c.pct >= 100 ? '#22c55e' : c.color
                  }}>
                    {c.pct}%
                    {c.pct >= 100 && <span style={{ marginLeft: '6px', fontSize: '13px' }}>✅</span>}
                  </span>
                </div>
                <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${c.pct}%`,
                    background: c.pct >= 100
                      ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                      : `linear-gradient(90deg, ${c.color}, ${c.color}aa)`,
                    borderRadius: '10px',
                    boxShadow: `0 0 10px ${c.color}60`,
                    transition: 'width 0.8s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day-by-day table */}
        <div style={{
          background: 'rgba(10, 14, 30, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '30px',
          overflowX: 'auto'
        }}>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', color: '#ffffff', marginBottom: '20px' }}>
            Progress Log — Course Detail
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', color: '#64748b', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
                {COURSES.map(c => (
                  <th key={c.id} style={{ textAlign: 'center', color: c.color, padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {c.label}
                  </th>
                ))}
                <th style={{ textAlign: 'center', color: '#facc15', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Overall
                </th>
              </tr>
            </thead>
            <tbody>
              {[...chartData].reverse().map((row, idx) => (
                <tr
                  key={row.day}
                  style={{
                    background: row.day === TODAY ? 'rgba(0,229,255,0.04)' : 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.04)'
                  }}
                >
                  <td style={{ padding: '10px 12px', color: row.day === TODAY ? '#00e5ff' : '#cbd5e1', fontWeight: row.day === TODAY ? '700' : '400' }}>
                    {dayLabel(row.day)} {row.day === TODAY && <span style={{ fontSize: '10px', background: 'rgba(0,229,255,0.15)', color: '#00e5ff', padding: '1px 6px', borderRadius: '8px', marginLeft: '6px' }}>NOW</span>}
                  </td>
                  {COURSES.map(c => {
                    const val = row.snap ? Math.round(((row.snap[c.id] || 0) / c.totalTopics) * 100) : 0;
                    return (
                      <td key={c.id} style={{ textAlign: 'center', padding: '10px 12px', color: val > 0 ? c.color : '#334155', fontWeight: val > 0 ? '700' : '400' }}>
                        {val}%
                      </td>
                    );
                  })}
                  <td style={{ textAlign: 'center', padding: '10px 12px', color: '#facc15', fontWeight: '700', fontFamily: 'Orbitron, sans-serif', fontSize: '13px' }}>
                    {row.overall}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
      <Footer />
    </div>
  );
}

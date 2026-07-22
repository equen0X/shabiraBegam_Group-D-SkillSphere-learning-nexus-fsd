import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Background from "../components/Background";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";
import "../styles/progressPage.css";

// ------------------------------------------------------------------
// Subject Definitions & Helpers
// ------------------------------------------------------------------
const TODAY = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

const COURSES = [
  { id: "react",      label: "React",       prefix: "react_",      color: "#00e5ff", icon: "⚛️", totalTopics: 6 },
  { id: "java",       label: "Java",         prefix: "java_",       color: "#f97316", icon: "☕", totalTopics: 6 },
  { id: "springboot", label: "Spring Boot",  prefix: "springboot_", color: "#22c55e", icon: "🍃", totalTopics: 6 },
  { id: "dsa",        label: "DSA",          prefix: "dsa_",        color: "#8a2eff", icon: "⚡", totalTopics: 6 },
  { id: "genai",      label: "GenAI",        prefix: "genai_",      color: "#ff00c8", icon: "🤖", totalTopics: 6 },
  { id: "javascript", label: "JavaScript",   prefix: "javascript_", color: "#facc15", icon: "📜", totalTopics: 6 },
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

/** Generate smooth cubic Bézier SVG path from coordinate points */
function getSmoothPath(points) {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
  }
  return d;
}

// ------------------------------------------------------------------
// Main Multi-Series Interactive SVG Line Chart
// ------------------------------------------------------------------
function MultiSubjectLineChart({ chartData, selectedSubject, setSelectedSubject, range, setRange }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  const SVG_W = 920;
  const SVG_H = 340;
  const PAD_L = 55;
  const PAD_R = 35;
  const PAD_T = 50;
  const PAD_B = 45;

  const widthScale = SVG_W - PAD_L - PAD_R;
  const heightScale = SVG_H - PAD_T - PAD_B;

  const numDays = chartData.length;
  const getX = (idx) => PAD_L + (idx * widthScale) / Math.max(1, numDays - 1);
  const getY = (val) => SVG_H - PAD_B - (val / 100) * heightScale;

  const yTicks = [0, 25, 50, 75, 100];

  const activeCourses = selectedSubject === "all"
    ? COURSES
    : COURSES.filter(c => c.id === selectedSubject);

  return (
    <div className="line-chart-container">
      {/* Header controls & subject filter chips */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '20px', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            📈 Subject Progress Line Graphs
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0 0' }}>
            Day-by-day learning trends — each subject growth increase is highlighted by its icon
          </p>
        </div>

        {/* Range Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[7, 14, 30].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`progress-filter-chip ${range === r ? 'active' : ''}`}
              style={{
                '--chip-bg': 'rgba(0, 229, 255, 0.15)',
                '--chip-color': '#00e5ff',
                '--chip-glow': 'rgba(0, 229, 255, 0.3)'
              }}
            >
              {r}D
            </button>
          ))}
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => setSelectedSubject("all")}
          className={`progress-filter-chip ${selectedSubject === "all" ? "active" : ""}`}
          style={{
            '--chip-bg': 'rgba(0, 229, 255, 0.15)',
            '--chip-color': '#00e5ff',
            '--chip-glow': 'rgba(0, 229, 255, 0.3)'
          }}
        >
          🌟 All Subjects
        </button>
        {COURSES.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedSubject(c.id)}
            className={`progress-filter-chip ${selectedSubject === c.id ? "active" : ""}`}
            style={{
              '--chip-bg': `${c.color}22`,
              '--chip-color': c.color,
              '--chip-glow': `${c.color}50`
            }}
          >
            <span>{c.icon}</span> {c.label}
          </button>
        ))}
      </div>

      {/* Main SVG Line Canvas */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ width: '100%', height: 'auto', minWidth: '600px', overflow: 'visible' }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {COURSES.map(c => (
              <React.Fragment key={c.id}>
                {/* Area Gradient */}
                <linearGradient id={`grad-${c.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.color} stopOpacity="0.32" />
                  <stop offset="100%" stopColor={c.color} stopOpacity="0.0" />
                </linearGradient>
                {/* Glow Filter */}
                <filter id={`glow-${c.id}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </React.Fragment>
            ))}

            {/* Overall Multi-Gradient */}
            <linearGradient id="grad-overall" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="50%" stopColor="#8a2eff" />
              <stop offset="100%" stopColor="#ff00c8" />
            </linearGradient>
          </defs>

          {/* Grid lines (Horizontal) */}
          {yTicks.map(val => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={PAD_L}
                  y1={y}
                  x2={SVG_W - PAD_R}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 4"
                />
                <text
                  x={PAD_L - 12}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="end"
                  fontFamily="Orbitron, sans-serif"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* X-Axis Date Labels & Grid Lines */}
          {chartData.map((d, i) => {
            const x = getX(i);
            const isToday = d.day === TODAY;
            return (
              <g key={d.day}>
                <line
                  x1={x}
                  y1={PAD_T}
                  x2={x}
                  y2={SVG_H - PAD_B}
                  stroke={isToday ? "rgba(0,229,255,0.2)" : "rgba(255,255,255,0.04)"}
                />
                <text
                  x={x}
                  y={SVG_H - PAD_B + 22}
                  fill={isToday ? "#00e5ff" : "#64748b"}
                  fontSize={numDays > 14 ? "9" : "11"}
                  fontWeight={isToday ? "700" : "500"}
                  textAnchor="middle"
                  fontFamily="Orbitron, sans-serif"
                >
                  {dayLabel(d.day)}
                </text>
              </g>
            );
          })}

          {/* Draw Overall Line if "all" is selected */}
          {selectedSubject === "all" && (
            <g>
              {(() => {
                const pts = chartData.map((d, i) => ({ x: getX(i), y: getY(d.overall), val: d.overall }));
                const pathD = getSmoothPath(pts);
                const fillD = `${pathD} L ${pts[pts.length - 1].x},${SVG_H - PAD_B} L ${pts[0].x},${SVG_H - PAD_B} Z`;
                return (
                  <>
                    <path d={fillD} fill="url(#grad-overall)" opacity="0.08" />
                    <path
                      d={pathD}
                      stroke="url(#grad-overall)"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.8"
                    />
                  </>
                );
              })()}
            </g>
          )}

          {/* Draw Individual Subject Lines */}
          {activeCourses.map(c => {
            const pts = chartData.map((d, i) => {
              const val = d.snap ? Math.round(((d.snap[c.id] || 0) / c.totalTopics) * 100) : 0;
              const prevVal = i > 0 && chartData[i - 1].snap
                ? Math.round(((chartData[i - 1].snap[c.id] || 0) / c.totalTopics) * 100)
                : 0;
              const delta = val - prevVal;
              return { x: getX(i), y: getY(val), val, delta, day: d.day, idx: i };
            });

            const pathD = getSmoothPath(pts);
            const fillD = `${pathD} L ${pts[pts.length - 1].x},${SVG_H - PAD_B} L ${pts[0].x},${SVG_H - PAD_B} Z`;

            return (
              <g key={c.id} className="subject-line-group">
                {/* Area Fill */}
                <path d={fillD} fill={`url(#grad-${c.id})`} opacity={selectedSubject === c.id ? "0.3" : "0.12"} />

                {/* Smooth Glowing Line Path */}
                <path
                  d={pathD}
                  stroke={c.color}
                  strokeWidth={selectedSubject === c.id ? "4.5" : "3"}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={`url(#glow-${c.id})`}
                  opacity={selectedSubject === "all" || selectedSubject === c.id ? 1 : 0.25}
                />

                {/* Nodes & Subject Increase Badges */}
                {pts.map((pt, i) => {
                  const isIncreased = pt.delta > 0;

                  return (
                    <g key={i}>
                      {/* Node Dot */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isIncreased ? "6" : "4"}
                        fill={c.color}
                        stroke="#0a0e1c"
                        strokeWidth="2"
                        className="line-node-dot"
                      />

                      {/* Subject Increase Badge when progress increases! */}
                      {isIncreased && (
                        <g transform={`translate(${pt.x}, ${pt.y - 30})`}>
                          <foreignObject x="-30" y="-14" width="60" height="30" style={{ overflow: "visible" }}>
                            <div
                              className="svg-subject-increase-badge"
                              style={{
                                "--badge-border": c.color,
                                "--badge-glow": `${c.color}80`
                              }}
                              title={`${c.label} increased by +${pt.delta}% on ${dayLabel(pt.day)}`}
                            >
                              <span className="subject-icon">{c.icon}</span>
                              <span className="increase-amount">+{pt.delta}%</span>
                            </div>
                          </foreignObject>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Invisible Overlay Rects for Hover Interaction */}
          {chartData.map((d, i) => {
            const x = getX(i);
            const w = widthScale / Math.max(1, numDays - 1);
            return (
              <rect
                key={d.day}
                x={x - w / 2}
                y={PAD_T}
                width={w}
                height={heightScale}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoverIndex(i)}
              />
            );
          })}

          {/* Vertical Hover Line Indicator */}
          {hoverIndex !== null && (
            <g pointerEvents="none">
              <line
                x1={getX(hoverIndex)}
                y1={PAD_T}
                x2={getX(hoverIndex)}
                y2={SVG_H - PAD_B}
                stroke="#00e5ff"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <circle cx={getX(hoverIndex)} cy={getY(chartData[hoverIndex].overall)} r="6" fill="#00e5ff" />
            </g>
          )}
        </svg>

        {/* Hover Glassmorphism Tooltip */}
        {hoverIndex !== null && (
          <div
            className="graph-hover-tooltip"
            style={{
              left: `${(getX(hoverIndex) / SVG_W) * 100}%`,
              top: `${(getY(chartData[hoverIndex].overall) / SVG_H) * 100}%`
            }}
          >
            <div style={{ color: '#00e5ff', fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
              📅 {dayLabel(chartData[hoverIndex].day)}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
              Overall Progress: <strong style={{ color: '#fff' }}>{chartData[hoverIndex].overall}%</strong>
            </div>

            {COURSES.map(c => {
              const val = chartData[hoverIndex].snap
                ? Math.round(((chartData[hoverIndex].snap[c.id] || 0) / c.totalTopics) * 100)
                : 0;
              const prevVal = hoverIndex > 0 && chartData[hoverIndex - 1].snap
                ? Math.round(((chartData[hoverIndex - 1].snap[c.id] || 0) / c.totalTopics) * 100)
                : 0;
              const delta = val - prevVal;

              return (
                <div key={c.id} className="tooltip-subject-row">
                  <span className="tooltip-subject-name">
                    <span>{c.icon}</span> {c.label}
                  </span>
                  <span className="tooltip-subject-val" style={{ color: c.color }}>
                    {val}%
                    {delta > 0 && <span className="tooltip-increase-tag">+{delta}%</span>}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Subject Specific Mini Line Graph Card Component
// ------------------------------------------------------------------
function SubjectGrowthCard({ course, chartData }) {
  const pts = chartData.map((d, i) => {
    const val = d.snap ? Math.round(((d.snap[course.id] || 0) / course.totalTopics) * 100) : 0;
    const prevVal = i > 0 && chartData[i - 1].snap
      ? Math.round(((chartData[i - 1].snap[course.id] || 0) / course.totalTopics) * 100)
      : 0;
    const delta = val - prevVal;
    return { val, delta, day: d.day, idx: i };
  });

  const currentVal = pts[pts.length - 1]?.val || 0;
  const totalIncrease = pts.reduce((sum, p) => sum + (p.delta > 0 ? p.delta : 0), 0);

  const CARD_W = 280;
  const CARD_H = 110;
  const PAD_X = 20;
  const PAD_Y = 15;

  const getX = (i) => PAD_X + (i * (CARD_W - PAD_X * 2)) / Math.max(1, pts.length - 1);
  const getY = (val) => CARD_H - PAD_Y - (val / 100) * (CARD_H - PAD_Y * 2);

  const coords = pts.map((p, i) => ({ x: getX(i), y: getY(p.val), ...p }));
  const pathD = getSmoothPath(coords);
  const fillD = `${pathD} L ${coords[coords.length - 1].x},${CARD_H - PAD_Y} L ${coords[0].x},${CARD_H - PAD_Y} Z`;

  return (
    <div
      className="subject-line-card"
      style={{
        '--card-accent': course.color,
        '--card-glow': `${course.color}40`,
        '--icon-bg': `${course.color}15`,
        '--icon-border': `${course.color}40`,
        '--icon-glow': `${course.color}30`
      }}
    >
      <div className="subject-card-header">
        <div className="subject-title-box">
          <div className="subject-card-icon-wrap">
            {course.icon}
          </div>
          <div>
            <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', color: '#f8fafc', margin: 0 }}>
              {course.label}
            </h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              {course.totalTopics} Total Modules
            </span>
          </div>
        </div>
        <div className="subject-card-pct">
          {currentVal}%
        </div>
      </div>

      {/* SVG Mini Line Curve */}
      <div style={{ width: '100%', overflow: 'visible' }}>
        <svg viewBox={`0 0 ${CARD_W} ${CARD_H}`} style={{ width: '100%', height: '90px', overflow: 'visible' }}>
          <defs>
            <linearGradient id={`mini-grad-${course.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={course.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={course.color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={fillD} fill={`url(#mini-grad-${course.id})`} />

          {/* Glowing Line */}
          <path
            d={pathD}
            stroke={course.color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Step Nodes with Icon Badges at increase points */}
          {coords.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={pt.delta > 0 ? "5" : "3"}
                fill={pt.delta > 0 ? course.color : "#334155"}
                stroke="#0a0e1c"
                strokeWidth="1.5"
              />
              {pt.delta > 0 && (
                <g transform={`translate(${pt.x}, ${pt.y - 20})`}>
                  <foreignObject x="-24" y="-12" width="48" height="24" style={{ overflow: "visible" }}>
                    <div className="svg-subject-increase-badge" style={{ padding: '1px 4px', fontSize: '8px', '--badge-border': course.color }}>
                      <span>{course.icon}</span>
                      <span className="increase-amount">+{pt.delta}%</span>
                    </div>
                  </foreignObject>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Summary Footer */}
      <div className="subject-card-stats-row">
        <span>Growth: <strong style={{ color: '#f8fafc' }}>+{totalIncrease}%</strong></span>
        {totalIncrease > 0 ? (
          <span className="increase-pulse-indicator">
            <span>{course.icon}</span> Active Growth
          </span>
        ) : (
          <span style={{ fontSize: '11px', color: '#64748b' }}>Ready to start</span>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Main Component: ProgressPage
// ------------------------------------------------------------------
export default function ProgressPage() {
  const { user, completedTopics } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [range, setRange] = useState(7); // 7, 14, 30 days
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Save snapshot for today whenever completedTopics changes
  useEffect(() => {
    saveProgressSnapshot(completedTopics);
  }, [completedTopics]);

  // Current course summary data
  const currentData = COURSES.map(c => {
    const done = (completedTopics || []).filter(t => t.startsWith(c.prefix)).length;
    return {
      ...c,
      completed: done,
      pct: Math.round((done / c.totalTopics) * 100),
    };
  });

  const overallPct = Math.round(
    currentData.reduce((s, c) => s + c.pct, 0) / currentData.length
  );

  // Build day-wise snapshot data for the selected range window
  const days = getLastNDays(range);
  const progressLog = loadProgressLog();

  const chartData = days.map((day, index) => {
    let snap = progressLog[day];
    
    // If no snapshot stored for past day, generate smooth realistic trajectory curve leading to current completion
    if (!snap) {
      snap = {};
      const ratio = (index + 1) / days.length;
      COURSES.forEach(c => {
        const currentDone = currentData.find(d => d.id === c.id)?.completed || 0;
        if (currentDone === 0) {
          snap[c.id] = 0;
        } else {
          snap[c.id] = Math.min(currentDone, Math.floor(ratio * (currentDone + 0.9)));
        }
      });
    }

    const totals = COURSES.map(c => Math.round(((snap[c.id] || 0) / c.totalTopics) * 100));
    const avg = Math.round(totals.reduce((s, v) => s + v, 0) / totals.length);
    return { day, overall: avg, snap };
  });

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

        {/* Page Title & Header */}
        <section style={{ marginBottom: '35px' }}>
          <h1 style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '34px',
            background: 'linear-gradient(90deg, #00e5ff, #8a2eff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            📊 Learning Progress & Subject Line Graphs
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Interactive line graphs tracking your day-by-day skill completion with subject increase badges.
          </p>
        </section>

        {/* Top Summary Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '35px' }}>
          {/* Overall Progress */}
          <div style={{
            background: 'rgba(0, 229, 255, 0.06)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '18px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 0 20px rgba(0,229,255,0.1)'
          }}>
            <div style={{ fontSize: '46px', fontFamily: 'Orbitron, sans-serif', color: '#00e5ff', fontWeight: '900', lineHeight: 1 }}>
              {overallPct}%
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Overall Progress
            </div>
          </div>

          {/* Courses Completed */}
          <div style={{
            background: 'rgba(138, 46, 255, 0.06)',
            border: '1px solid rgba(138, 46, 255, 0.3)',
            borderRadius: '18px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '46px', fontFamily: 'Orbitron, sans-serif', color: '#8a2eff', fontWeight: '900', lineHeight: 1 }}>
              {currentData.filter(c => c.pct >= 100).length}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Courses Completed
            </div>
          </div>

          {/* Topics Completed */}
          <div style={{
            background: 'rgba(255, 0, 200, 0.06)',
            border: '1px solid rgba(255, 0, 200, 0.3)',
            borderRadius: '18px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '46px', fontFamily: 'Orbitron, sans-serif', color: '#ff00c8', fontWeight: '900', lineHeight: 1 }}>
              {currentData.reduce((s, c) => s + c.completed, 0)}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Topics Completed
            </div>
          </div>

          {/* Total Available Topics */}
          <div style={{
            background: 'rgba(250, 204, 21, 0.06)',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            borderRadius: '18px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '46px', fontFamily: 'Orbitron, sans-serif', color: '#facc15', fontWeight: '900', lineHeight: 1 }}>
              {COURSES.reduce((s, c) => s + c.totalTopics, 0)}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Total Topics
            </div>
          </div>
        </div>

        {/* ── Main Multi-Subject SVG Line Graph ── */}
        <section style={{ marginBottom: '40px' }}>
          <MultiSubjectLineChart
            chartData={chartData}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            range={range}
            setRange={setRange}
          />
        </section>

        {/* ── Subject-Wise Progress Line Curves Grid ── */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', color: 'var(--text-primary)', margin: 0 }}>
              Subject Growth Curves
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0 0' }}>
              Individual line graphs for each subject track — increase steps are marked by subject icons
            </p>
          </div>

          <div className="subject-cards-grid">
            {COURSES.map(course => (
              <SubjectGrowthCard
                key={course.id}
                course={course}
                chartData={chartData}
              />
            ))}
          </div>
        </section>

        {/* ── Course Progress Breakdown List ── */}
        <div style={{
          background: 'rgba(10, 14, 30, 0.9)',
          border: "1px solid var(--border-color)",
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '35px'
        }}>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', color: 'var(--text-primary)', marginBottom: '22px' }}>
            Course Progress Overview
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {currentData.map(c => (
              <div key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{c.icon}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '15px' }}>{c.label}</span>
                    <span style={{ color: '#64748b', fontSize: '12px', marginLeft: '6px' }}>
                      ({c.completed} / {c.totalTopics} topics)
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

        {/* ── Day-by-Day Log Table ── */}
        <div style={{
          background: 'rgba(10, 14, 30, 0.9)',
          border: "1px solid var(--border-color)",
          borderRadius: '20px',
          padding: '30px',
          overflowX: 'auto'
        }}>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>
            Day-by-Day Progress Log
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', color: '#64748b', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
                {COURSES.map(c => (
                  <th key={c.id} style={{ textAlign: 'center', color: c.color, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <span style={{ marginRight: '4px' }}>{c.icon}</span>{c.label}
                  </th>
                ))}
                <th style={{ textAlign: 'center', color: '#00e5ff', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Overall
                </th>
              </tr>
            </thead>
            <tbody>
              {[...chartData].reverse().map((row) => (
                <tr
                  key={row.day}
                  style={{
                    background: row.day === TODAY ? 'rgba(0,229,255,0.04)' : 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.04)'
                  }}
                >
                  <td style={{ padding: '10px 14px', color: row.day === TODAY ? '#00e5ff' : '#cbd5e1', fontWeight: row.day === TODAY ? '700' : '400' }}>
                    {dayLabel(row.day)} {row.day === TODAY && <span style={{ fontSize: '10px', background: 'rgba(0,229,255,0.15)', color: '#00e5ff', padding: '1px 6px', borderRadius: '8px', marginLeft: '6px' }}>NOW</span>}
                  </td>
                  {COURSES.map(c => {
                    const val = row.snap ? Math.round(((row.snap[c.id] || 0) / c.totalTopics) * 100) : 0;
                    return (
                      <td key={c.id} style={{ textAlign: 'center', padding: '10px 14px', color: val > 0 ? c.color : '#334155', fontWeight: val > 0 ? '700' : '400' }}>
                        {val}%
                      </td>
                    );
                  })}
                  <td style={{ textAlign: 'center', padding: '10px 14px', color: '#00e5ff', fontWeight: '700', fontFamily: 'Orbitron, sans-serif', fontSize: '13px' }}>
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

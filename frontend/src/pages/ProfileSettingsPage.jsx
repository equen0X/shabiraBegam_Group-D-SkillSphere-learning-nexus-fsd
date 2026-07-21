import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Background from "../components/Background";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";
import { FiSave, FiUser, FiGlobe, FiBriefcase, FiCheck } from "react-icons/fi";
import "../styles/dashboard.css";

export default function ProfileSettingsPage() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Local Form states
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [skills, setSkills] = useState("");
  const [accent, setAccent] = useState("#00e5ff");

  // Load from context on mount
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setTitle(user.title || (user.role === "EMPLOYEE" ? "Workforce Operations Manager" : "Software Engineering Student"));
      setBio(user.bio || "");
      setEmail(user.contact_email || user.email || "");
      setGithub(user.github || "");
      setLinkedin(user.linkedin || "");
      setSkills(user.skills || "React, JavaScript, Java");
      setAccent(user.themeAccent || "#00e5ff");
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setToastMsg("⚠️ Full Name cannot be empty!");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }

    updateUserProfile({
      full_name: fullName.trim(),
      title: title.trim(),
      bio: bio.trim(),
      contact_email: email.trim(),
      github: github.trim(),
      linkedin: linkedin.trim(),
      skills: skills.trim(),
      themeAccent: accent
    });

    setToastMsg("✅ Profile Settings Updated Successfully!");
    setTimeout(() => setToastMsg(""), 4000);
  };

  const accentsList = [
    { label: "Cyber Cyan", color: "#00e5ff" },
    { label: "Electric Purple", color: "#8a2eff" },
    { label: "Sakura Pink", color: "#ff00c8" },
    { label: "Neon Green", color: "#22c55e" },
    { label: "Gold Amber", color: "#facc15" }
  ];

  const isStudent = user?.role === "STUDENT";

  return (
    <div className={`dashboard-page ${isSidebarOpen && isStudent ? 'with-sidebar' : ''}`} style={{ minHeight: '100vh', background: '#05060b', color: '#fff' }}>
      <Background />
      <Navbar 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
        showSidebarToggle={isStudent} 
      />
      {isStudent && (
        <DashboardSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      )}

      <main className="dashboard-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '110px 24px 60px 24px' }}>
        
        {/* Toast Toast Alert banner */}
        {toastMsg && (
          <div style={{
            position: 'fixed', top: '85px', right: '25px', zIndex: 9999,
            background: 'linear-gradient(135deg, #00e5ff, #8a2be2)', color: '#ffffff',
            padding: '14px 24px', borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 229, 255, 0.4)',
            display: 'flex', alignItems: 'center', gap: '12px',
            fontWeight: '700', fontSize: '15px', animation: 'fadeIn 0.3s ease'
          }}>
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Page Header */}
        <section style={{ marginBottom: '35px' }}>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '32px', color: accent, marginBottom: '8px' }}>
            ⚙️ Profile Settings
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0 }}>
            Manage your personal profile details, expertise list, social handles, and select custom UI console accent theme settings.
          </p>
        </section>

        {/* Settings Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* Left Edit Form Card */}
          <form onSubmit={handleSave} style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: `1px solid ${accent}40`,
            borderRadius: '20px',
            padding: '35px 30px',
            boxShadow: '0 10px 35px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiUser size={20} style={{ color: accent }} />
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', color: '#ffffff', margin: 0 }}>
                Personal Info
              </h3>
            </div>

            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px', fontWeight: '700' }}>Full Name:</label>
              <input 
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px', fontWeight: '700' }}>Job Title / Headline:</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px', fontWeight: '700' }}>Bio (Brief Intro):</label>
              <textarea 
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px', fontWeight: '700' }}>Contact Email:</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>

            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiGlobe size={20} style={{ color: accent }} />
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', color: '#ffffff', margin: 0 }}>
                Social Handles
              </h3>
            </div>

            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px', fontWeight: '700' }}>GitHub Profile Link:</label>
              <input 
                type="url"
                placeholder="https://github.com/username"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px', fontWeight: '700' }}>LinkedIn Profile Link:</label>
              <input 
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>

            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiBriefcase size={20} style={{ color: accent }} />
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', color: '#ffffff', margin: 0 }}>
                Professional Skills
              </h3>
            </div>

            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px', fontWeight: '700' }}>Technical Skills (Comma separated):</label>
              <input 
                type="text"
                placeholder="React, Java, Spring Boot, MySQL"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>

            {/* Save Buttons */}
            <button
              type="submit"
              style={{
                background: `linear-gradient(90deg, ${accent}, #8a2eff)`,
                color: '#ffffff',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: `0 0 15px ${accent}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px'
              }}
            >
              <FiSave size={18} />
              Save Profile Changes
            </button>
          </form>

          {/* Right Preview Card & Theme Picker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Live Profile Card Preview */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: `2px solid ${accent}`,
              borderRadius: '20px',
              padding: '30px',
              boxShadow: `0 0 30px ${accent}25`,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
                background: `linear-gradient(135deg, ${accent}30 0%, #05060b 100%)`,
                zIndex: 1
              }} />

              <div style={{ position: 'relative', zIndex: 2, marginTop: '20px' }}>
                <div style={{
                  width: '90px', height: '90px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${accent}, #8a2eff)`,
                  color: '#ffffff', fontSize: '32px', fontWeight: '800',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 15px auto',
                  boxShadow: `0 0 20px ${accent}50`,
                  border: '3px solid #05060b'
                }}>
                  {fullName ? fullName.charAt(0).toUpperCase() : (user?.username || "U").charAt(0).toUpperCase()}
                </div>

                <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', color: '#ffffff', margin: '0 0 5px 0' }}>
                  {fullName || "Your Full Name"}
                </h3>
                <span style={{ fontSize: '13px', color: accent, fontWeight: '700', textTransform: 'uppercase', fontFamily: 'Orbitron, sans-serif' }}>
                  {user?.role} • {title || "Role / Title"}
                </span>

                <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '15px 0', lineHeight: '1.5', minHeight: '60px' }}>
                  {bio || "Your short bio description will appear here..."}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', margin: '15px 0' }}>
                  {skills.split(',').map((skill, index) => (
                    skill.trim() && (
                      <span key={index} style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#94a3b8',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {skill.trim()}
                      </span>
                    )
                  ))}
                </div>

                {/* Social links preview */}
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '15px', marginTop: '15px' }}>
                  {github && (
                    <a href={github} target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                      🔗 GitHub
                    </a>
                  )}
                  {linkedin && (
                    <a href={linkedin} target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                      🔗 LinkedIn
                    </a>
                  )}
                  {!github && !linkedin && (
                    <span style={{ color: '#64748b', fontSize: '12px' }}>No social links connected</span>
                  )}
                </div>
              </div>
            </div>

            {/* Theme Accent Picker Card */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
            }}>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', color: '#ffffff', margin: '0 0 15px 0' }}>
                Console Theme Accent
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {accentsList.map(item => (
                  <button
                    key={item.color}
                    type="button"
                    onClick={() => setAccent(item.color)}
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: accent === item.color ? `2px solid ${item.color}` : '1px solid rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      padding: '12px 18px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontWeight: '700',
                      fontSize: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: item.color }} />
                      <span>{item.label}</span>
                    </div>
                    {accent === item.color && <FiCheck style={{ color: item.color }} />}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
      
      <Footer />
    </div>
  );
}

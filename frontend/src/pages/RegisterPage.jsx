import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Background from '../components/Background';
import '../styles/loginModal.css'; // Reuses modal backdrop elements if needed, though we style the page layout inline

export default function RegisterPage() {
  const { signupLocal, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole = location.state?.role || 'STUDENT';
  const initialStep = location.state?.step || 1;

  const [step, setStep] = useState(initialStep); // 1 = Role selection, 2 = Form inputs
  const [role, setRole] = useState(initialRole);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDevBypass, setShowDevBypass] = useState(false);

  const googleBtnRef = useRef(null);
  const roleRef = useRef(role);

  // Keep role ref updated to avoid stale closure variables in the async Google callback
  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    if (step !== 2) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    setShowDevBypass(true);

    const initGoogleSignUp = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId || 'mock_client_id',
            callback: async (response) => {
              try {
                setError('');
                // Register user with their selected Google credentials and role
                const registeredUser = await loginWithGoogle(response.credential, roleRef.current);
                if (registeredUser) {
                  if (roleRef.current === 'EMPLOYEE' && (registeredUser.email.toLowerCase().includes('student') || registeredUser.email.toLowerCase().endsWith('.edu'))) {
                    setError('Enter valid workplace email id');
                    await logout();
                    return;
                  }
                  if (registeredUser.role === 'STUDENT') {
                    navigate('/student-home');
                  } else if (registeredUser.role === 'EMPLOYEE') {
                    navigate('/workforce-home');
                  } else {
                    navigate('/');
                  }
                }
              } catch (err) {
                setError(err.message || 'Google registration failed');
              }
            }
          });

          if (googleBtnRef.current) {
            window.google.accounts.id.renderButton(
              googleBtnRef.current,
              { theme: 'filled_blue', size: 'large', width: '280', text: 'signup_with' }
            );
          }
        } catch (err) {
          console.warn('Google Identity initialization error:', err);
          setShowDevBypass(true);
        }
      } else {
        setTimeout(initGoogleSignUp, 100);
      }
    };

    initGoogleSignUp();
  }, [step, navigate, loginWithGoogle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === 'EMPLOYEE' && (email.toLowerCase().includes('student') || email.toLowerCase().endsWith('.edu'))) {
      setError('Enter valid workplace email id');
      return;
    }
    try {
      setError('');
      const registeredUser = await signupLocal(username, fullName, email, password, role);
      if (registeredUser && registeredUser.role === 'STUDENT') {
        navigate('/student-home');
      } else {
        navigate('/workforce-home');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleDevBypass = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please fill in the Email Address field to bypass Google registration');
      return;
    }
    if (role === 'EMPLOYEE' && (email.toLowerCase().includes('student') || email.toLowerCase().endsWith('.edu'))) {
      setError('Enter valid workplace email id');
      return;
    }
    try {
      setError('');
      const registeredUser = await loginWithGoogle(`mock_google_token_${email}`, role);
      if (registeredUser && registeredUser.role === 'STUDENT') {
        navigate('/student-home');
      } else {
        navigate('/workforce-home');
      }
    } catch (err) {
      setError(err.message || 'Developer bypass registration failed');
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: 'var(--text-primary)',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <Background />

      {/* Header Bar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto 40px auto',
        padding: '10px 0',
        zIndex: 5
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'Orbitron' }} onClick={() => navigate('/')}>
          <span style={{ color: '#00E5FF', fontSize: '28px', textShadow: '0 0 10px cyan' }}>⬢</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '22px' }}>Skill</span>
          <span style={{ color: '#00E5FF', fontWeight: 'bold', fontSize: '22px' }}>Sphere</span>
        </div>
        <button 
          onClick={() => navigate('/')} 
          style={{
            background: 'transparent',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            color: '#cfcfcf',
            padding: '10px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          Back to Home
        </button>
      </header>

      {/* Main Container */}
      <main style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        zIndex: 5
      }}>
        
        {/* STEP 1: CHOICE PANEL */}
        {step === 1 && (
          <div style={{
            background: 'rgba(18, 18, 30, 0.8)',
            border: "1px solid var(--border-color)",
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(99, 102, 241, 0.1)',
            borderRadius: '20px',
            padding: '40px 30px',
            width: '100%',
            maxWidth: '560px',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '10px',
              background: 'linear-gradient(135deg, #a5b4fc, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Join SkillSphere
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '40px' }}>
              Choose your account type to get started
            </p>

            <div style={{
              display: 'flex',
              flexDirection: window.innerWidth < 600 ? 'column' : 'row',
              gap: '20px',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              {/* Student Selection Card */}
              <div style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.03)',
                border: "1px solid var(--border-color)",
                borderRadius: '16px',
                padding: '30px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.3s'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>🎓</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Student</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', height: '40px', marginBottom: '20px', textAlign: 'center' }}>
                  Enroll in courses, complete quizzes, earn XP and badges.
                </p>
                <button
                  onClick={() => { setRole('STUDENT'); setStep(2); }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    border: '2px solid #ff00c8',
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Sign Up as Student
                </button>
              </div>

              {/* Workforce Selection Card */}
              <div style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.03)',
                border: "1px solid var(--border-color)",
                borderRadius: '16px',
                padding: '30px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.3s'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>💼</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Workforce</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', height: '40px', marginBottom: '20px', textAlign: 'center' }}>
                  Manage workspace profiles, assign projects, track attendance and scores.
                </p>
                <button
                  onClick={() => { setRole('EMPLOYEE'); setStep(2); }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #ff00c8, #b0008c)',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Sign Up as Workforce
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FORM AND OAUTH PANEL */}
        {step === 2 && (
          <div style={{
            background: 'rgba(18, 18, 30, 0.8)',
            border: "1px solid var(--border-color)",
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(99, 102, 241, 0.1)',
            borderRadius: '20px',
            padding: '35px 30px',
            width: '100%',
            maxWidth: '440px',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: '700',
              marginBottom: '6px',
              background: 'linear-gradient(135deg, #a5b4fc, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {role === 'STUDENT' ? 'Student Registration' : 'Workforce Registration'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '25px' }}>
              Create your profile using the HTML form or Google
            </p>

            {error && <div className="errorMessage" style={{ textAlign: 'left', marginBottom: '15px' }}>{error}</div>}

            {/* Basic HTML Sign-Up Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <label style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '500' }}>Username</label>
              <input
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', marginBottom: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
              />

              <label style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '500' }}>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', marginBottom: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
              />

              <label style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '500' }}>Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', marginBottom: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
              />

              <label style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '500' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: '100%', padding: '10px 12px', marginBottom: '15px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
              />

              <button
                type="submit"
                style={{ width: '100%', padding: '12px', background: '#ff00c8', border: 'none', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
              >
                Complete {role === 'STUDENT' ? 'Student' : 'Workforce'} Sign-Up
              </button>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            {/* Google Signup Button Container */}
            <div className="googleButtonWrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <div ref={googleBtnRef} id="googleSignUpButton"></div>
            </div>

            {showDevBypass && (
              <div style={{ marginTop: '15px', textAlign: 'left' }}>
                <p style={{ fontSize: '11px', color: '#fbbf24', margin: '5px 0' }}>⚠️ Mock Dev Mode Bypass for Google Signup:</p>
                <button
                  onClick={handleDevBypass}
                  style={{ width: '100%', padding: '10px', background: '#4f46e5', border: 'none', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Bypass Google Sign-Up (Uses Email field above)
                </button>
              </div>
            )}

            <button
              onClick={() => setStep(1)}
              style={{
                marginTop: '25px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '13px',
                textDecoration: 'underline'
              }}
            >
              Back to account types
            </button>
          </div>
        )}

      </main>

      {/* Footer copyright */}
      <footer style={{
        textAlign: 'center',
        fontSize: '12px',
        color: '#475569',
        padding: '20px 0',
        zIndex: 5
      }}>
        &copy; {new Date().getFullYear()} SkillSphere. All rights reserved.
      </footer>
    </div>
  );
}

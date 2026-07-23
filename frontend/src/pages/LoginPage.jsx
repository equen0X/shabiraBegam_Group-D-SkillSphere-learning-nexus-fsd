import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/loginPage.css";

export default function LoginPage() {
  const { user, loginLocal, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected Role State (Student or Workforce)
  const [role, setRole] = useState(location.state?.role || 'STUDENT');
  const roleRef = useRef(role);

  // Sync ref to avoid stale closures in Google API callback
  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  if (user) {
    return <Navigate to={user.role === 'EMPLOYEE' ? '/workforce-home' : '/student-home'} replace />;
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showDevBypass, setShowDevBypass] = useState(false);
  const [devEmail, setDevEmail] = useState("");
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    setShowDevBypass(true);

    const initGoogleSignIn = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId || 'mock_client_id',
            callback: async (response) => {
              try {
                setError('');
                // Pass current selected role to login verification
                const user = await loginWithGoogle(response.credential, roleRef.current);
                if (user) {
                  if (user.role === 'STUDENT') {
                    navigate('/student-home');
                  } else if (user.role === 'EMPLOYEE') {
                    navigate('/workforce-home');
                  } else {
                    navigate('/');
                  }
                }
              } catch (err) {
                setError(err.message || 'Google authentication failed');
              }
            }
          });
          
          if (googleBtnRef.current) {
            window.google.accounts.id.renderButton(
              googleBtnRef.current,
              { theme: 'filled_blue', size: 'large', width: '340' }
            );
          }
        } catch (err) {
          console.warn('Google accounts initialization error:', err);
          setShowDevBypass(true);
        }
      } else {
        setTimeout(initGoogleSignIn, 100);
      }
    };

    initGoogleSignIn();
  }, [loginWithGoogle, navigate, logout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setError("");
      const user = await loginLocal(email, password);
      if (user) {
        if (role === 'EMPLOYEE' && user.role === 'STUDENT') {
          setError('Enter valid workplace email id');
          await logout();
          return;
        }
        if (role === 'STUDENT' && user.role !== 'STUDENT') {
          setError('This account is registered as a Workforce user. Please use the Workforce Portal.');
          await logout();
          return;
        }
        if (user.role === 'STUDENT') {
          navigate('/student-home');
        } else {
          navigate('/workforce-home');
        }
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  const handleDevBypass = async (e) => {
    e.preventDefault();
    if (!devEmail) return;
    try {
      setError("");
      const user = await loginWithGoogle(`mock_google_token_${devEmail}`, role);
      if (user) {
        if (role === 'EMPLOYEE' && user.role === 'STUDENT') {
          setError('Enter valid workplace email id');
          await logout();
          return;
        }
        if (role === 'STUDENT' && user.role !== 'STUDENT') {
          setError('This account is registered as a Workforce user. Please use the Workforce Portal.');
          await logout();
          return;
        }
        if (user.role === 'STUDENT') {
          navigate('/student-home');
        } else {
          navigate('/workforce-home');
        }
      }
    } catch (err) {
      setError(err.message || "Developer bypass login failed");
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Header Bar */}
      <header className="header-bar">
        <Link to="/" className="logo-brand">
          <span className="logo-icon" style={{ 
            color: role === 'STUDENT' ? '#00E5FF' : '#ff00c8', 
            textShadow: role === 'STUDENT' ? '0 0 10px cyan' : '0 0 10px #ff00c8',
            transition: 'all 0.3s' 
          }}>⬢</span>
          <span className="logo-text-skill">Skill</span>
          <span className="logo-text-sphere" style={{ 
            color: role === 'STUDENT' ? '#00E5FF' : '#ff00c8',
            transition: 'color 0.3s' 
          }}>Sphere</span>
        </Link>
        <Link to="/" className="back-btn">
          Back to Home
        </Link>
      </header>

      <div className="container">
        <div className="login-card" style={{
          border: role === 'STUDENT' ? '1px solid rgba(0, 229, 255, 0.15)' : '1px solid rgba(255, 0, 200, 0.15)',
          boxShadow: role === 'STUDENT' 
            ? '0 20px 45px rgba(0, 0, 0, 0.55), 0 0 35px rgba(0, 229, 255, 0.1)'
            : '0 20px 45px rgba(0, 0, 0, 0.55), 0 0 35px rgba(255, 0, 200, 0.1)',
          transition: 'all 0.3s'
        }}>
          <h1>Welcome Back</h1>
          
          <p className="subtitle" style={{ 
            color: role === 'STUDENT' ? '#00e5ff' : '#ff00c8', 
            textShadow: role === 'STUDENT' ? '0 0 5px rgba(0, 229, 255, 0.2)' : '0 0 5px rgba(255, 0, 200, 0.2)', 
            transition: 'color 0.3s',
            fontWeight: '600'
          }}>
            {role === 'STUDENT' ? "Student Access Portal" : "Workforce Access Portal"}
          </p>

          {/* Role Switcher Tabs */}
          <div className="login-role-tabs" style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '25px',
            border: "1px solid var(--border-color)"
          }}>
            <button
              type="button"
              onClick={() => setRole('STUDENT')}
              style={{
                flex: 1,
                padding: '12px',
                background: role === 'STUDENT' ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: role === 'STUDENT' ? '#00e5ff' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textShadow: role === 'STUDENT' ? '0 0 8px rgba(0, 229, 255, 0.4)' : 'none',
                fontFamily: "'Outfit', 'Inter', sans-serif"
              }}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => setRole('EMPLOYEE')}
              style={{
                flex: 1,
                padding: '12px',
                background: role === 'EMPLOYEE' ? 'rgba(255, 0, 200, 0.15)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: role === 'EMPLOYEE' ? '#ff00c8' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textShadow: role === 'EMPLOYEE' ? '0 0 8px rgba(255, 0, 200, 0.4)' : 'none',
                fontFamily: "'Outfit', 'Inter', sans-serif"
              }}
            >
              💼 Workforce
            </button>
          </div>

          {error && <div className="errorMessage">{error}</div>}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-content">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder={role === 'STUDENT' ? "student@gmail.com" : "manager@company.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  borderColor: role === 'STUDENT' ? '' : '#3a205a'
                }}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: role === 'STUDENT' ? '' : '#ff00c8' }}>Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              className="login-btn"
              style={{
                background: role === 'STUDENT' 
                  ? 'linear-gradient(90deg, #00e5ff, #8a2be2)' 
                  : 'linear-gradient(90deg, #ff00c8, #8a2be2)',
                boxShadow: role === 'STUDENT'
                  ? '0 10px 25px rgba(0, 229, 255, 0.25)'
                  : '0 10px 25px rgba(255, 0, 200, 0.25)'
              }}
            >
              Log In
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            {/* Google Login Container with Custom UI Overlay */}
            <div style={{ position: 'relative', width: '100%', height: '52px', margin: '10px 0' }}>
              <button className="google-btn" type="button" onClick={e => e.preventDefault()} style={{ margin: 0, height: '100%', width: '100%' }}>
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google Logo"
                />
                <span>Google</span>
              </button>
              {!showDevBypass && (
                <div
                  ref={googleBtnRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    overflow: 'hidden',
                    zIndex: 2,
                    cursor: 'pointer'
                  }}
                ></div>
              )}
            </div>

            {showDevBypass && (
              <div className="devBypassSection">
                <p className="devNote">⚠️ Mock Dev Mode. Enter email to bypass Google ({role}):</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    placeholder={role === 'STUDENT' ? "student@skillsphere.com" : "employee@skillsphere.com"}
                    value={devEmail}
                    onChange={(e) => setDevEmail(e.target.value)}
                    className="devInput"
                    style={{ margin: 0 }}
                  />
                  <button 
                    type="button" 
                    onClick={handleDevBypass} 
                    className="devSubmitBtn" 
                    style={{ 
                      width: 'auto', 
                      whiteSpace: 'nowrap',
                      background: role === 'STUDENT' ? '' : '#ff00c8'
                    }}
                  >
                    Bypass
                  </button>
                </div>
              </div>
            )}

            <p className="signup-text">
              Don't have an account?{" "}
              <Link to="/register" style={{ color: role === 'STUDENT' ? '#00e5ff' : '#ff00c8' }}>Sign up here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

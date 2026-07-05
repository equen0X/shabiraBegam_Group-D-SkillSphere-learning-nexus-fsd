import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/loginPage.css";

export default function LoginPage() {
  const { loginLocal, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showDevBypass, setShowDevBypass] = useState(false);
  const [devEmail, setDevEmail] = useState("");
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'google_mock_client_id_for_testing') {
      setShowDevBypass(true);
    }

    const initGoogleSignIn = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId || 'mock_client_id',
            callback: async (response) => {
              try {
                setError('');
                await loginWithGoogle(response.credential);
                navigate('/');
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
  }, [loginWithGoogle, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setError("");
      await loginLocal(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  const handleDevBypass = async (e) => {
    e.preventDefault();
    if (!devEmail) return;
    try {
      setError("");
      await loginWithGoogle(`mock_google_token_${devEmail}`);
      navigate("/");
    } catch (err) {
      setError(err.message || "Developer bypass login failed");
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Header Bar */}
      <header className="header-bar">
        <Link to="/" className="logo-brand">
          <span className="logo-icon">⬢</span>
          <span className="logo-text-skill">Skill</span>
          <span className="logo-text-sphere">Sphere</span>
        </Link>
        <Link to="/" className="back-btn">
          Back to Home
        </Link>
      </header>

      <div className="container">
        <div className="login-card">
          <h1>Welcome Back</h1>
          <p className="subtitle">Let's Login to Your Account</p>

          {error && <div className="errorMessage">{error}</div>}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-content">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn">
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
                <p className="devNote">⚠️ Mock Dev Mode. Enter email to bypass Google:</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    placeholder="student@skillsphere.com"
                    value={devEmail}
                    onChange={(e) => setDevEmail(e.target.value)}
                    className="devInput"
                    style={{ margin: 0 }}
                  />
                  <button type="button" onClick={handleDevBypass} className="devSubmitBtn" style={{ width: 'auto', whiteSpace: 'nowrap' }}>
                    Bypass
                  </button>
                </div>
              </div>
            )}

            <p className="signup-text">
              Don't have an account?{" "}
              <Link to="/register">Sign up here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

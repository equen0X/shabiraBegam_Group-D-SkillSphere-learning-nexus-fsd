import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/loginModal.css';

export default function SignupModal({ isOpen, onClose }) {
  const { signupLocal, loginWithGoogle } = useAuth();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [showDevBypass, setShowDevBypass] = useState(false);
  
  const googleBtnRef = useRef(null);
  const roleRef = useRef(role);

  // Sync role to ref to avoid stale closures in the async Google callback
  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    if (!isOpen) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'google_mock_client_id_for_testing') {
      setShowDevBypass(true);
    }

    const initGoogleSignUp = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId || 'mock_client_id',
            callback: async (response) => {
              try {
                setError('');
                // Pass the current selected role to Google login/register handler
                await loginWithGoogle(response.credential, roleRef.current);
                onClose();
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
          console.warn('Google accounts initialization warning:', err);
          setShowDevBypass(true);
        }
      } else {
        setTimeout(initGoogleSignUp, 100);
      }
    };

    initGoogleSignUp();
  }, [isOpen, onClose, loginWithGoogle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await signupLocal(username, fullName, email, password, role);
      onClose();
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
    try {
      setError('');
      // Simulate Google signup with the chosen email and role
      await loginWithGoogle(`mock_google_token_${email}`, role);
      onClose();
    } catch (err) {
      setError(err.message || 'Developer bypass registration failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button className="closeBtn" onClick={onClose} aria-label="Close modal">&times;</button>
        
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px', background: 'linear-gradient(135deg, #a5b4fc, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Create Account
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
          Sign up to join the SkillSphere platform
        </p>

        {error && <div className="errorMessage">{error}</div>}

        {/* Basic HTML Sign-Up Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <label style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '500' }}>Username</label>
          <input
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 12px', marginBottom: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none' }}
          />

          <label style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '500' }}>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 12px', marginBottom: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none' }}
          />

          <label style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '500' }}>Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 12px', marginBottom: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none' }}
          />

          <label style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '500' }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 12px', marginBottom: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none' }}
          />

          <label style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '500' }}>I want to sign up as a:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', marginBottom: '15px', background: '#12121e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none' }}
          >
            <option value="STUDENT">Student (Portal Access)</option>
            <option value="EMPLOYEE">Workforce (Employee/Team Access)</option>
          </select>

          <button
            type="submit"
            style={{ width: '100%', padding: '12px', background: '#ff00c8', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', fontSize: '14px' }}
          >
            Create Account
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="googleButtonWrapper">
          <div ref={googleBtnRef} id="googleSignUpButton"></div>
        </div>

        {showDevBypass && (
          <div style={{ marginTop: '15px', textAlign: 'left' }}>
            <p style={{ fontSize: '11px', color: '#fbbf24', margin: '10px 0 5px 0' }}>⚠️ Mock Dev Mode Bypass for Google Signup:</p>
            <button
              onClick={handleDevBypass}
              style={{ width: '100%', padding: '10px', background: '#4f46e5', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              Bypass Google Sign-Up (Uses Email field + Role selection)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

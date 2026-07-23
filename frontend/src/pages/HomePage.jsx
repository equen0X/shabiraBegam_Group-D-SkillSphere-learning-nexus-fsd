import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '700',
        marginBottom: '10px',
        letterSpacing: '-0.5px',
        background: 'linear-gradient(135deg, #a5b4fc, #6366f1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        homep age comming soon
      </h1>
      
      {user && (
        <p style={{
          color: '#94a3b8',
          fontSize: '16px',
          marginBottom: '30px'
        }}>
          Logged in as: <span style={{ color: '#00E5FF', fontWeight: '600' }}>{user.full_name || user.username}</span> ({user.role})
        </p>
      )}

      <button
        onClick={logout}
        style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #ff00c8, #b0008c)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '15px',
          boxShadow: '0 4px 15px rgba(255, 0, 200, 0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        Logout
      </button>
    </div>
  );
}

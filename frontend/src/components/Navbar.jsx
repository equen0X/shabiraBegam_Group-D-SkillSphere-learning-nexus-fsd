import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
        <div className="logoIcon">⬢</div>
        <span className="skill">Skill</span>
        <span className="sphere">Sphere</span>
      </Link>

      <nav className="navLinks">
        {location.pathname !== "/" && (
          <Link to="/" className="backHome">
            Home
          </Link>
        )}
        <Link to="/features">Features</Link>
        <Link to="/learning">Learning</Link>
        <Link to="/workforce">Workforce</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <div className="navButtons">
        <button className="xpBtn">⚡ 2450 XP</button>

        {user ? (
          <div className="userProfileContainer">
            <div className="userProfileBadge">
              <div className="avatarCircle">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
              </div>
              <div className="userInfoText">
                <span className="userName">{user.full_name || user.username}</span>
                <span className="userRoleBadge">{user.role}</span>
              </div>
            </div>
            <button className="logoutBtn" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="loginBtn" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="loginBtn" style={{ background: '#ff00c8', borderColor: '#ff00c8' }} onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
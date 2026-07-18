import "../styles/footer.css";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="footer">

      <div className="footerTop">

        <div className="footerBrand">
          <h2>SkillSphere</h2>
          <p>
            Empowering students and organizations through
            gamified learning and workforce management.
          </p>
        </div>

        <div className="footerLinks">
          <h3>Quick Links</h3>

          {user && user.role === 'STUDENT' ? (
            <>
              <Link to="/student-home">Home</Link>
              <Link to="/student-features">Features</Link>
              <Link to="/learning">Learning</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/sandbox">Sandbox</Link>
            </>
          ) : user && user.role === 'EMPLOYEE' ? (
            <>
              <Link to="/workforce-home">Home</Link>
              <Link to="/workforce-features">Features</Link>
              <Link to="/workforce-dashboard">Dashboard</Link>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/features">Features</Link>
              <Link to="/learning">Learning</Link>
              <Link to="/workforce">Workforce</Link>
              <Link to="/sandbox">Sandbox</Link>
              <Link to="/contact">Contact</Link>
            </>
          )}
        </div>

        <div className="footerContact">
          <h3>Connect</h3>

          <div className="socialIcons">
            <FaGithub />
            <FaLinkedin />
            <FaEnvelope />
          </div>
        </div>

      </div>

      <div className="footerBottom">
        © 2026 SkillSphere. All Rights Reserved.
      </div>

    </footer>
  );
}
import "../styles/footer.css";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
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

          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">Dashboard</a>
          <a href="#">Contact</a>
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
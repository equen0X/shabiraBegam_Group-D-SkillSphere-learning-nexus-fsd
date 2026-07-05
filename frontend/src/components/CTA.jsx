import { useNavigate } from "react-router-dom";
import "../styles/cta.css";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="cta">

      <h2>Ready to Transform Learning & Workforce Management?</h2>

      <p>
        Empower students, educators, employees, and organizations with one intelligent platform
        for learning, collaboration, and productivity.
      </p>

      <div className="ctaButtons">
        <button className="ctaBtn" onClick={() => navigate('/register')}>Get Started</button>
      </div>

    </section>
  );
}
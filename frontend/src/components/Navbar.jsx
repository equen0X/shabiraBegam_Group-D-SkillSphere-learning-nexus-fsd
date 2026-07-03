import "../styles/navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">

      <div className="logo">

        <div className="logoIcon">
          ⬢
        </div>

        <span className="skill">Skill</span>
        <span className="sphere">Sphere</span>

      </div>

      <nav className="navLinks">

        <a href="#">Features</a>

        <a href="#">Learning</a>

        <a href="#">Workforce</a>

        <a href="#">Pricing</a>

        <a href="#">Contact</a>

      </nav>

      <div className="navButtons">

        <button className="xpBtn">
          ⚡ 2450 XP
        </button>

        <button className="loginBtn">
          Login
        </button>

      </div>

    </header>
  );
}
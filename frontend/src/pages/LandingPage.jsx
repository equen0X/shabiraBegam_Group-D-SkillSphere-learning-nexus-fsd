// import { useEffect } from "react";
// import Navbar from "../components/Navbar";
// import Hero from "../components/Hero";
// import Background from "../components/Background";
//
// import "../styles/landing.css";
//
// export default function LandingPage() {
//
//   useEffect(() => {
//
//     const glow = document.querySelector(".cursorGlow");
//
//     const move = (e) => {
//       glow.style.left = `${e.clientX}px`;
//       glow.style.top = `${e.clientY}px`;
//     };
//
//     window.addEventListener("mousemove", move);
//
//     return () => window.removeEventListener("mousemove", move);
//
//   }, []);
//
//   return (
//     <div className="landing">
//
//       <Background />
//
//       <div className="cursorGlow"></div>
//
//       <Navbar />
//
//       <Hero />
//
//     </div>
//   );
// }

// import Navbar from "../components/Navbar";
// import Hero from "../components/Hero";
// import Background from "../components/Background";
// import UserSelection from "../components/UserSelection";
//
// import "../styles/landing.css";
//
// export default function LandingPage() {
//   return (
//     <div className="landing">
//
//       <Background />
//
//       <Navbar />
//
//       <Hero />
//
//       <UserSelection />
//
//     </div>
//   );
// }

// import Navbar from "../components/Navbar";
// import Hero from "../components/Hero";
// import Background from "../components/Background";
// import UserSelection from "../components/UserSelection";
// import Features from "../components/Features";
// import Workforce from "../components/Workforce";
// import Stats from "../components/Stats";
//
// import "../styles/landing.css";
//
// export default function LandingPage() {
//   return (
//     <div className="landing">
//
//       <Background />
//
//       <Navbar />
//
//       <Hero />
//
//       <UserSelection />
//
//       <Features />
//
//       <Workforce />
//
//       <Stats />
//
//     </div>
//   );
// }

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Background from "../components/Background";
import UserSelection from "../components/UserSelection";
import Stats from "../components/Stats";
import Timeline from "../components/Timeline";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

import "../styles/landing.css";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'STUDENT') {
        navigate('/student-home');
      } else if (user.role === 'EMPLOYEE') {
        navigate('/workforce-home');
      }
    }
  }, [user, navigate]);

  return (
    <div className="landing">
      <Background />

      <Navbar />

      <Hero />

      <UserSelection />

      {/* <Features/> */}

      {/* <Workforce/> */}

      <Stats />

      <Timeline />

      <Testimonials />

      {/* <FAQ/> */}

      <CTA />

      <Footer />
    </div>
  );
}
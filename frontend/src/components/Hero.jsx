// import HeroCard from "./HeroCard";
// import "../styles/hero.css";
//
// export default function Hero() {
//   return (
//     <section className="hero">
//
//       <div className="heroLeft">
//
//         <div className="badge">
//           🎮 NEW SEASON LIVE • EARN DOUBLE XP
//         </div>
//
//         <h1>
//           Turn Learning
//           <br />
//           Into
//           <br />
//           <span>An Epic Quest</span>
//         </h1>
//
//         <p>
//           Complete assignments, earn XP, unlock achievements and
//           climb the leaderboard with SkillSphere.
//         </p>
//
//         <div className="heroButtons">
//
//           <button className="primaryBtn">
//             Existing User
//           </button>
//
//           <button className="secondaryBtn">
//             New User
//           </button>
//
//         </div>
//
//         <button className="googleBtn">
//
//           <img
//             src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
//             alt="Google"
//           />
//
//           Continue with Google
//
//         </button>
//
//         <div className="stats">
//
//           <div>
//             <h2>12K+</h2>
//             <span>Students</span>
//           </div>
//
//           <div>
//             <h2>94%</h2>
//             <span>Retention</span>
//           </div>
//
//           <div>
//             <h2>500+</h2>
//             <span>Schools</span>
//           </div>
//
//         </div>
//
//       </div>
//
//       <HeroCard />
//
//     </section>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HeroCard from "./HeroCard";
import "../styles/hero.css";

export default function Hero() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showDevBypass, setShowDevBypass] = useState(false);
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'google_mock_client_id_for_testing') {
      setShowDevBypass(true);
      return;
    }

    const initGoogleSignIn = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              try {
                await loginWithGoogle(response.credential);
                navigate('/');
              } catch (err) {
                console.error(err);
                alert(err.message || 'Google authentication failed');
              }
            }
          });
          
          if (googleBtnRef.current) {
            window.google.accounts.id.renderButton(
              googleBtnRef.current,
              { theme: 'filled_blue', size: 'large', width: '280' }
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

  const handleDevBypassClick = async () => {
    const email = window.prompt("⚠️ Running in Mock Dev Mode. Enter email to bypass Google auth:", "student@skillsphere.com");
    if (email) {
      try {
        await loginWithGoogle(`mock_google_token_${email}`);
        navigate('/');
      } catch (err) {
        alert(err.message || 'Developer bypass login failed');
      }
    }
  };

  return (

<section className="hero">

<div className="heroLeft">

<div className="badge">
🚀 AI Powered Learning & Workforce Platform
</div>

<h1>

Level Up

<br/>

Learning &

<br/>

<span>Workforce Management</span>

</h1>

<p>

One intelligent platform for students,
professionals, managers and organizations.

Track learning, manage teams,
earn achievements and monitor performance —
all in one futuristic workspace.

</p>

<div className="heroButtons">

<button className="primaryBtn" onClick={() => navigate('/login')}>

Student Login

</button>

<button className="secondaryBtn" onClick={() => navigate('/login')}>

Workforce Login

</button>

</div>

{showDevBypass ? (
  <button className="googleBtn" onClick={handleDevBypassClick}>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
      alt="google"
    />
    Continue with Google
  </button>
) : (
  <div style={{ position: 'relative', display: 'inline-block', marginTop: '25px' }}>
    <button className="googleBtn" type="button" style={{ margin: 0 }}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
        alt="google"
      />
      Continue with Google
    </button>
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
  </div>
)}

<div className="stats">

<div>

<h2>25K+</h2>

<span>Active Learners</span>

</div>

<div>

<h2>98%</h2>

<span>Course Completion</span>

</div>

<div>

<h2>700+</h2>

<span>Organizations</span>

</div>

</div>

</div>

<HeroCard/>

</section>

  );
}
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

import HeroCard from "./HeroCard";
import "../styles/hero.css";

export default function Hero() {
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

<button className="primaryBtn">

Student Login

</button>

<button className="secondaryBtn">

Workforce Login

</button>

</div>

<button className="googleBtn">

<img

src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"

alt="google"

/>

Continue with Google

</button>

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
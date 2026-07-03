// export default function HeroCard() {
//   return (
//     <div className="heroCard">
//
//       <div className="ring ring1"></div>
//       <div className="ring ring2"></div>
//
//       <div className="cardContent">
//
//         <div className="profile">
//
//           <div className="avatar">
//             🎓
//           </div>
//
//           <div>
//             <h3>Player_Alex</h3>
//             <span>🔥 14 Day Streak</span>
//           </div>
//
//           <div className="level">
//             LVL 24
//           </div>
//
//         </div>
//
//         <p>Experience</p>
//
//         <div className="xpBar">
//           <div className="xpFill"></div>
//         </div>
//
//         <div className="task">
//           ✔ Complete Daily Attendance
//           <span>+50 XP</span>
//         </div>
//
//         <div className="task">
//           ⚔ Submit Assignment
//           <span>+120 XP</span>
//         </div>
//
//         <div className="task">
//           🏆 Score 90% on Quiz
//           <span>+200 XP</span>
//         </div>
//
//       </div>
//
//     </div>
//   );
// }

import "../styles/hero.css";

export default function HeroCard(){

return(

<div className="heroCard">

<div className="cardContent">

<div className="profile">

<div className="avatar">

👩🏻‍💻

</div>

<div>

<h3>Sarah Johnson</h3>

<p>Senior Developer</p>

</div>

<div className="level">

LVL 32

</div>

</div>

<h4>Monthly Progress</h4>

<div className="xpBar">

<div className="xpFill"></div>

</div>

<div className="task">

<span>React Certification</span>

<span>✔</span>

</div>

<div className="task">

<span>Leadership Training</span>

<span>✔</span>

</div>

<div className="task">

<span>Quarterly Goals</span>

<span>94%</span>

</div>

<div className="task">

<span>Performance Score</span>

<span className="green">

96%

</span>

</div>

</div>

</div>

)

}
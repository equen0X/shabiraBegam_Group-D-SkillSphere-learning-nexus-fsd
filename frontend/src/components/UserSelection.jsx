import { useNavigate } from "react-router-dom";
import "../styles/userSelection.css";

export default function UserSelection(){
  const navigate = useNavigate();

  return(

<section className="selection">

<h2>

Choose Your Workspace

</h2>

<div className="selectionGrid">

<div className="selectCard">

<div className="emoji">

🎓

</div>

<h3>

Student Portal

</h3>

<p>

Courses

Assignments

Quizzes

Certificates

Leaderboards

</p>

<button onClick={() => navigate('/login')}>

Enter Portal

</button>

</div>

<div className="selectCard">

<div className="emoji">

💼

</div>

<h3>

Workforce Portal

</h3>

<p>

Employees

Performance

Attendance

Projects

Analytics

</p>

<button onClick={() => navigate('/login')}>

Manage Team

</button>

</div>

</div>

</section>

)

}
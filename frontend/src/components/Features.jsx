import "../styles/features.css";
import {
  FaRobot,
  FaGraduationCap,
  FaChartLine,
  FaUsers,
  FaMedal,
  FaBrain,
} from "react-icons/fa";

export default function Features() {

  const cards = [
    {
      icon: <FaGraduationCap />,
      title: "Smart Learning",
      text: "Interactive learning paths with certifications."
    },

    {
      icon: <FaBrain />,
      title: "AI Assistant",
      text: "Personal AI mentor for students and employees."
    },

    {
      icon: <FaChartLine />,
      title: "Analytics",
      text: "Track progress with beautiful dashboards."
    },

    {
      icon: <FaUsers />,
      title: "Team Collaboration",
      text: "Manage projects and assignments together."
    },

    {
      icon: <FaRobot />,
      title: "Automation",
      text: "Attendance, reminders and smart scheduling."
    },

    {
      icon: <FaMedal />,
      title: "Achievements",
      text: "XP, badges and leaderboard rewards."
    }

  ];

  return (

<section className="features">

<h2>

Powerful Platform Features

</h2>

<div className="featureGrid">

{cards.map((card,index)=>(

<div className="featureCard" key={index}>

<div className="icon">

{card.icon}

</div>

<h3>{card.title}</h3>

<p>{card.text}</p>

</div>

))}

</div>

</section>

  );

}
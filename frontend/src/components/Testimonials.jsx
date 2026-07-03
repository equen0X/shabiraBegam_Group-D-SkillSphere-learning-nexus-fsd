import "../styles/testimonials.css";
import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Aarav Sharma",
    role: "Computer Science Student",
    text: "SkillSphere completely changed the way I learn. Tracking progress, earning badges and joining challenges keeps me motivated every day."
  },
  {
    name: "Priya Singh",
    role: "HR Manager",
    text: "Managing employee learning paths has never been easier. Training completion increased by more than 40%."
  },
  {
    name: "Rahul Das",
    role: "Software Engineer",
    text: "The personalized dashboard and certification tracking helped me upskill while balancing my daily work."
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials">

      <h2>Testimonials</h2>

      <p className="subtitle">
        Trusted by Students & Organizations
      </p>

      <div className="testimonialGrid">

        {reviews.map((review, index) => (

          <div className="testimonialCard" key={index}>

            <div className="stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <p className="review">
              "{review.text}"
            </p>

            <div className="profile">

              <div className="avatar">
                {review.name.charAt(0)}
              </div>

              <div>
                <h4>{review.name}</h4>
                <span>{review.role}</span>
              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}
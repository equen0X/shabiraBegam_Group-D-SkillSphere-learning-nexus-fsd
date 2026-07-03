import "../styles/timeline.css";

export default function Timeline() {

  const steps = [
    {
      title: "Enroll",
      text: "Join a course or company workspace."
    },
    {
      title: "Learn",
      text: "Attend sessions and complete assignments."
    },
    {
      title: "Earn XP",
      text: "Gain points, badges and achievements."
    },
    {
      title: "Get Certified",
      text: "Receive certificates and promotions."
    }
  ];

  return (

    <section className="timeline">

      <h2>Learning Journey</h2>

      <div className="timelineContainer">

        {steps.map((step, index) => (

          <div className="timelineCard" key={index}>

            <div className="circle">
              {index + 1}
            </div>

            <h3>{step.title}</h3>

            <p>{step.text}</p>

          </div>

        ))}

      </div>

    </section>

  );
}
import "../styles/gamification.css";

export default function Gamification() {

  const badges = [
    "🔥 Daily Streak",
    "🏆 Top Performer",
    "🚀 Fast Learner",
    "💎 Elite Member",
    "⭐ Quiz Master",
    "⚡ Attendance Hero",
  ];

  return (
    <section className="gamification">

      <h2>Gamified Learning Experience</h2>

      <p className="gameSubtitle">
        Complete tasks, earn XP, unlock achievements and climb the leaderboard.
      </p>

      <div className="badgeGrid">

        {badges.map((badge, index) => (
          <div className="badgeCard" key={index}>
            {badge}
          </div>
        ))}

      </div>

    </section>
  );
}
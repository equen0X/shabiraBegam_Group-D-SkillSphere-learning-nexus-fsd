import { useNavigate } from "react-router-dom";
import "../styles/userSelection.css";

export default function UserSelection(){
  const navigate = useNavigate();

  return(
    <section className="selection">
      <h2>Choose Your Workspace</h2>
      
      <div className="selectionGrid">
        {/* Student Portal Card */}
        <div className="selectCard">
          <div className="emoji">🎓</div>
          <h3>Student Portal</h3>
          
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 auto 35px auto',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '320px'
          }}>
            <li style={{ fontSize: '18px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#00e5ff' }}>📚</span> 50+ Interactive Course Tracks
            </li>
            <li style={{ fontSize: '18px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#00e5ff' }}>⚡</span> Real-time XP & Level Progression
            </li>
            <li style={{ fontSize: '18px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#00e5ff' }}>🏆</span> Live Leaderboards & Daily Quests
            </li>
            <li style={{ fontSize: '18px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#00e5ff' }}>📜</span> Blockchain Certificate Verification
            </li>
          </ul>

          <button onClick={() => navigate('/register', { state: { role: 'STUDENT', step: 2 } })}>
            Enter Portal
          </button>
        </div>

        {/* Workforce Portal Card */}
        <div className="selectCard">
          <div className="emoji">💼</div>
          <h3>Workforce Portal</h3>
          
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 auto 35px auto',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '320px'
          }}>
            <li style={{ fontSize: '18px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#ff00c8' }}>👥</span> Unified Employee Directories
            </li>
            <li style={{ fontSize: '18px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#ff00c8' }}>🎯</span> Project Assignments & Progress
            </li>
            <li style={{ fontSize: '18px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#ff00c8' }}>✈️</span> Real-time Leave Request Workflows
            </li>
            <li style={{ fontSize: '18px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#ff00c8' }}>📈</span> Detailed Team Performance Analytics
            </li>
          </ul>

          <button onClick={() => navigate('/register', { state: { role: 'EMPLOYEE', step: 2 } })}>
            Manage Team
          </button>
        </div>
      </div>
    </section>
  );
}
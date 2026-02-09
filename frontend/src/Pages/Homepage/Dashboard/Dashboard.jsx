import './Dashboard.css';

const Dashboard = () => {
  const features = [
    { title: 'Smart Notes Maker', desc: 'AI-powered note taking and organization' },
    { title: 'Doubt Solver', desc: 'Get instant AI solutions to your questions' },
    { title: 'Resume Analyzer', desc: 'AI-powered resume feedback and optimization' },
    { title: 'Interview Simulator', desc: 'Practice with AI-driven mock interviews' }
  ];

  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>
      <div className="dashboard-grid">
        {features.map((feature, index) => (
          <div key={index} className="dashboard-card">
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
            <button className="card-btn">Try Now</button>
          </div>
        ))}
      </div>
      <div className="ai-section">
        <h2>AI-Powered Features</h2>
        <p>Our platform uses advanced AI to enhance your learning and career journey.</p>
      </div>
    </div>
  );
};

export default Dashboard;
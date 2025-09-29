import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

const LandingPage = () => {
  return (
    <div className="App-section landing-page">
      <div className="landing-intro">
        <h2>Welcome to pickleKing</h2>
        <p>Track coworker pickleball matches and rankings in real time.</p>
      </div>

      <div className="landing-links">
        <Link className="landing-card" to="/leaderboard/singles">
          <h3>Singles Leaderboard</h3>
          <p>See individual player rankings and match records.</p>
        </Link>
        <Link className="landing-card" to="/leaderboard/teams">
          <h3>Teams Leaderboard</h3>
          <p>Follow doubles teams as they climb the standings.</p>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;

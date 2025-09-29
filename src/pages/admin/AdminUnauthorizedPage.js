import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminUnauthorizedPage = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="App-section auth-section">
      <div className="auth-card">
        <h2>Access Restricted</h2>
        <p>You are signed in, but your account is not authorized for admin tools.</p>
        <div className="auth-actions">
          <Link className="auth-button" to="/leaderboard/singles">
            Go to Public Leaderboard
          </Link>
          <button className="auth-button" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUnauthorizedPage;

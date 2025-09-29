import React from 'react';
import TeamLeaderboard from '../../components/TeamLeaderboard';
import { useTeamsLeaderboard } from '../../hooks/useLeaderboardData';

const PublicTeamsPage = () => {
  const { items: teams, loading, error } = useTeamsLeaderboard();

  return (
    <div className="App-section">
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading-state">Loading teams...</div>
      ) : (
        <TeamLeaderboard teams={teams} allowEditing={false} />
      )}
    </div>
  );
};

export default PublicTeamsPage;

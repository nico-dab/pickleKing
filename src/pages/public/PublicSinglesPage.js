import React from 'react';
import Leaderboard from '../../components/Leaderboard';
import { usePlayersLeaderboard } from '../../hooks/useLeaderboardData';

const PublicSinglesPage = () => {
  const { items: players, loading, error } = usePlayersLeaderboard();

  return (
    <div className="App-section">
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading-state">Loading players...</div>
      ) : (
        <Leaderboard players={players} allowEditing={false} />
      )}
    </div>
  );
};

export default PublicSinglesPage;

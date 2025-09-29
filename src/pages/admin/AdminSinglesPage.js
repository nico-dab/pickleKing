import React from 'react';
import AddPlayer from '../../components/AddPlayer';
import Leaderboard from '../../components/Leaderboard';
import { usePlayersLeaderboard } from '../../hooks/useLeaderboardData';
import { useAuth } from '../../context/AuthContext';

const AdminSinglesPage = () => {
  const { isAdmin } = useAuth();
  const {
    items: players,
    loading,
    error,
    addItem: addPlayer,
    updateStats,
    resetStats,
    removeItem,
    renameItem,
  } = usePlayersLeaderboard();

  return (
    <div className="App-section">
      {error && <div className="error-message">{error}</div>}
      <AddPlayer onAddPlayer={addPlayer} />
      {loading ? (
        <div className="loading-state">Loading players...</div>
      ) : (
        <Leaderboard
          players={players}
          onUpdateStats={updateStats}
          onResetStats={resetStats}
          onRemovePlayer={removeItem}
          onRenamePlayer={renameItem}
          allowEditing={isAdmin}
        />
      )}
    </div>
  );
};

export default AdminSinglesPage;

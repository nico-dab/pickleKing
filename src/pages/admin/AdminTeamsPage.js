import React from 'react';
import AddTeam from '../../components/AddTeam';
import TeamLeaderboard from '../../components/TeamLeaderboard';
import { useTeamsLeaderboard } from '../../hooks/useLeaderboardData';
import { useAuth } from '../../context/AuthContext';

const AdminTeamsPage = () => {
  const { isAdmin } = useAuth();
  const {
    items: teams,
    loading,
    error,
    addItem: addTeam,
    updateStats,
    resetStats,
    removeItem,
    renameItem,
  } = useTeamsLeaderboard();

  return (
    <div className="App-section">
      {error && <div className="error-message">{error}</div>}
      <AddTeam onAddTeam={addTeam} />
      {loading ? (
        <div className="loading-state">Loading teams...</div>
      ) : (
        <TeamLeaderboard
          teams={teams}
          onUpdateStats={updateStats}
          onResetStats={resetStats}
          onRemoveTeam={removeItem}
          onRenameTeam={renameItem}
          allowEditing={isAdmin}
        />
      )}
    </div>
  );
};

export default AdminTeamsPage;

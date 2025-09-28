import React from 'react';
import './Leaderboard.css';

const medalLabels = ['Gold', 'Silver', 'Bronze'];

const Leaderboard = ({
  players,
  onUpdateStats,
  onResetStats,
  onRemovePlayer,
  onRenamePlayer,
}) => {
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    const aWinRate = a.wins + a.losses > 0 ? a.wins / (a.wins + a.losses) : 0;
    const bWinRate = b.wins + b.losses > 0 ? b.wins / (b.wins + b.losses) : 0;
    return bWinRate - aWinRate;
  });

  const calculateWinRate = (wins, losses) => {
    const total = wins + losses;
    return total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
  };

  const getMedalLabel = (index) => medalLabels[index] ?? null;

  const updatePlayerWins = (playerId) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) {
      return;
    }

    onUpdateStats(playerId, player.wins + 1, player.losses, player.points + 10);
  };

  const updatePlayerLosses = (playerId) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) {
      return;
    }

    onUpdateStats(playerId, player.wins, player.losses + 1, Math.max(0, player.points - 5));
  };

  const handleRenamePlayer = async (player) => {
    const newName = window.prompt('Rename player', player.name);
    if (newName === null) {
      return;
    }

    const trimmed = newName.trim();
    if (!trimmed || trimmed === player.name) {
      return;
    }

    await onRenamePlayer(player.id, trimmed);
  };

  const handleResetStats = async (player) => {
    const confirmed = window.confirm('Reset stats for ' + player.name + '?');
    if (!confirmed) {
      return;
    }

    await onResetStats(player.id);
  };

  const handleRemovePlayer = async (player) => {
    const confirmed = window.confirm('Remove ' + player.name + ' from the leaderboard?');
    if (!confirmed) {
      return;
    }

    await onRemovePlayer(player.id);
  };

  return (
    <div className="leaderboard">
      <h2>Current Rankings</h2>

      <div className="leaderboard-table">
        <div className="table-header">
          <div className="rank-col">Rank</div>
          <div className="name-col">Player</div>
          <div className="stats-col">W/L</div>
          <div className="rate-col">Win Rate</div>
          <div className="points-col">Points</div>
          <div className="actions-col">Actions</div>
        </div>

        {sortedPlayers.map((player, index) => {
          const medalLabel = getMedalLabel(index);

          return (
            <div key={player.id} className={'player-row' + (index < 3 ? ' podium' : '')}>
              <div className="rank-col">
                <span className="rank-number">#{index + 1}</span>
                {medalLabel && (
                  <span className={'rank-medal rank-medal-' + (index + 1)}>
                    {medalLabel}
                  </span>
                )}
              </div>

              <div className="name-col">
                <strong>{player.name}</strong>
              </div>

              <div className="stats-col">
                <span className="wins">{player.wins}</span>
                <span className="separator">-</span>
                <span className="losses">{player.losses}</span>
              </div>

              <div className="rate-col">
                <span className="win-rate">{calculateWinRate(player.wins, player.losses)}%</span>
              </div>

              <div className="points-col">
                <span className="points">{player.points}</span>
              </div>

              <div className="actions-col">
                <button
                  className="win-btn"
                  onClick={() => updatePlayerWins(player.id)}
                  title="Record a win"
                >
                  +W
                </button>
                <button
                  className="loss-btn"
                  onClick={() => updatePlayerLosses(player.id)}
                  title="Record a loss"
                >
                  +L
                </button>
                <button
                  className="admin-btn rename-btn"
                  onClick={() => handleRenamePlayer(player)}
                  title="Rename player"
                >
                  Rename
                </button>
                <button
                  className="admin-btn reset-btn"
                  onClick={() => handleResetStats(player)}
                  title="Reset stats"
                >
                  Reset
                </button>
                <button
                  className="admin-btn remove-btn"
                  onClick={() => handleRemovePlayer(player)}
                  title="Remove player"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {players.length === 0 && (
        <div className="empty-state">
          <p>No players yet! Add some players to start tracking matches.</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

import React, { useEffect, useState } from 'react';
import './Leaderboard.css';

const medalMeta = [
  { display: '🥇', className: 'gold', announcement: 'Gold medal position' },
  { display: '🥈', className: 'silver', announcement: 'Silver medal position' },
  { display: '🥉', className: 'bronze', announcement: 'Bronze medal position' },
];

const getFirstName = (name = '') => {
  const trimmed = name.trim();
  if (!trimmed) {
    return '';
  }

  const token = trimmed.split(/\s+/)[0];
  return token.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '');
};

const Leaderboard = ({
  players,
  onUpdateStats,
  onResetStats,
  onRemovePlayer,
  onRenamePlayer,
  allowEditing = true,
}) => {
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [renaming, setRenaming] = useState(false);
  const isReadOnly = !allowEditing;

  useEffect(() => {
    if (isReadOnly) {
      setEditingPlayerId(null);
      setEditingName('');
      setRenaming(false);
    }
  }, [isReadOnly]);

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
    return total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';
  };

  const getMedalMeta = (index) => medalMeta[index] ?? null;

  const startRenamingPlayer = (player) => {
    if (isReadOnly) {
      return;
    }

    setEditingPlayerId(player.id);
    setEditingName(player.name);
  };

  const cancelRenamingPlayer = () => {
    setEditingPlayerId(null);
    setEditingName('');
    setRenaming(false);
  };

  const submitRename = async (player) => {
    if (isReadOnly) {
      return;
    }

    const trimmed = editingName.trim();
    if (!trimmed || renaming) {
      return;
    }

    setRenaming(true);
    const success = await onRenamePlayer(player.id, trimmed);
    setRenaming(false);

    if (success) {
      setEditingPlayerId(null);
      setEditingName('');
    }
  };

  const handleRenameKeyDown = async (event, player) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await submitRename(player);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      cancelRenamingPlayer();
    }
  };

  const updatePlayerWins = (playerId) => {
    if (isReadOnly) {
      return;
    }

    const player = players.find((p) => p.id === playerId);
    if (!player) {
      return;
    }

    onUpdateStats(playerId, player.wins + 1, player.losses, player.points + 10);
  };

  const updatePlayerLosses = (playerId) => {
    if (isReadOnly) {
      return;
    }

    const player = players.find((p) => p.id === playerId);
    if (!player) {
      return;
    }

    onUpdateStats(playerId, player.wins, player.losses + 1, Math.max(0, player.points - 5));
  };

  const handleResetStats = async (player) => {
    if (isReadOnly) {
      return;
    }

    const confirmed = window.confirm('Reset stats for ' + player.name + '?');
    if (!confirmed) {
      return;
    }

    await onResetStats(player.id);
  };

  const handleRemovePlayer = async (player) => {
    if (isReadOnly) {
      return;
    }

    const confirmed = window.confirm('Remove ' + player.name + ' from the leaderboard?');
    if (!confirmed) {
      return;
    }

    await onRemovePlayer(player.id);
  };

  return (
    <div className={'leaderboard' + (allowEditing ? '' : ' leaderboard-readonly')}>
      <h2>Current Rankings</h2>

      <div className="leaderboard-table">
        <div className={'table-header' + (allowEditing ? '' : ' table-header-readonly')}>
          <div className="rank-col">Rank</div>
          <div className="name-col">Player</div>
          <div className="stats-col">W/L</div>
          <div className="rate-col">Win Rate</div>
          <div className="points-col">Points</div>
          {allowEditing && <div className="actions-col">Actions</div>}
        </div>

        {sortedPlayers.map((player, index) => {
          const medal = getMedalMeta(index);
          const isEditing = allowEditing && editingPlayerId === player.id;
          const displayName = getFirstName(player.name);
          const winRate = calculateWinRate(player.wins, player.losses);
          const rowClassName =
            'player-row' +
            (index < 3 ? ' podium' : '') +
            (allowEditing ? '' : ' player-row-readonly');

          return (
            <div key={player.id} className={rowClassName}>
              <div className="player-main">
                <div className="rank-col">
                  <span className="rank-number">#{index + 1}</span>
                  {!isEditing && medal && (
                    <span
                      className={'medal-label medal-label-' + medal.className}
                      aria-label={medal.announcement}
                    >
                      {medal.display}
                    </span>
                  )}
                </div>

                <div className="name-col">
                  {isEditing ? (
                    <input
                      className="rename-input"
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      onKeyDown={(event) => handleRenameKeyDown(event, player)}
                      maxLength={50}
                      autoFocus
                    />
                  ) : (
                    <strong className="player-name" title={player.name}>
                      {displayName || player.name}
                    </strong>
                  )}

                  <div className="player-meta">
                    <span
                      className="player-record"
                      aria-label={`${player.wins} wins and ${player.losses} losses`}
                    >
                      <span className="wins">{player.wins}</span>
                      <span className="meta-divider">-</span>
                      <span className="losses">{player.losses}</span>
                    </span>
                    <span className="meta-separator" aria-hidden="true">
                      •
                    </span>
                    <span className="player-rate">{winRate}% WR</span>
                  </div>
                </div>

                <div className="points-col">
                  <span className="points">{player.points}</span>
                  <span className="points-label">pts</span>
                </div>
              </div>

              {allowEditing && (
                <div className="actions-col">
                  {isEditing ? (
                    <>
                      <button
                        className="admin-btn save-btn"
                        onClick={() => submitRename(player)}
                        disabled={renaming || !editingName.trim()}
                      >
                        {renaming ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        className="admin-btn cancel-btn"
                        onClick={cancelRenamingPlayer}
                        disabled={renaming}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
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
                        onClick={() => startRenamingPlayer(player)}
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
                    </>
                  )}
                </div>
              )}
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

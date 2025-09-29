import React, { useEffect, useState } from 'react';
import './Leaderboard.css';

const medalMeta = [
  { display: '🥇', className: 'gold', announcement: 'Gold medal position' },
  { display: '🥈', className: 'silver', announcement: 'Silver medal position' },
  { display: '🥉', className: 'bronze', announcement: 'Bronze medal position' },
];

const getFirstName = (value = '') => {
  const trimmed = (value ?? '').trim();
  if (!trimmed) {
    return '';
  }
  const token = trimmed.split(/\s+/)[0];
  return token.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '');
};

const formatTeamMembers = (team) => {
  const first = getFirstName(team.player_one) || 'Player 1';
  const second = getFirstName(team.player_two) || 'Player 2';
  return `${first} · ${second}`;
};

const TeamLeaderboard = ({
  teams,
  onUpdateStats,
  onResetStats,
  onRemoveTeam,
  onRenameTeam,
  allowEditing = true,
}) => {
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingValues, setEditingValues] = useState({
    name: '',
    playerOne: '',
    playerTwo: '',
  });
  const [renaming, setRenaming] = useState(false);
  const isReadOnly = !allowEditing;

  useEffect(() => {
    if (isReadOnly) {
      setEditingTeamId(null);
      setEditingValues({ name: '', playerOne: '', playerTwo: '' });
      setRenaming(false);
    }
  }, [isReadOnly]);

  const sortedTeams = [...teams].sort((a, b) => {
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

  const startEditingTeam = (team) => {
    if (isReadOnly) {
      return;
    }

    setEditingTeamId(team.id);
    setEditingValues({
      name: team.name ?? '',
      playerOne: team.player_one ?? '',
      playerTwo: team.player_two ?? '',
    });
  };

  const cancelEditingTeam = () => {
    setEditingTeamId(null);
    setEditingValues({ name: '', playerOne: '', playerTwo: '' });
    setRenaming(false);
  };

  const submitRename = async (team) => {
    if (isReadOnly || renaming) {
      return;
    }

    const payload = {
      name: editingValues.name.trim(),
      playerOne: editingValues.playerOne.trim(),
      playerTwo: editingValues.playerTwo.trim(),
    };

    if (!payload.name || !payload.playerOne || !payload.playerTwo) {
      return;
    }

    setRenaming(true);
    const success = await onRenameTeam(team.id, payload);
    setRenaming(false);

    if (success) {
      setEditingTeamId(null);
      setEditingValues({ name: '', playerOne: '', playerTwo: '' });
    }
  };

  const handleRenameKeyDown = async (event, team) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await submitRename(team);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEditingTeam();
    }
  };

  const updateTeamWins = (teamId) => {
    if (isReadOnly) {
      return;
    }

    const team = teams.find((t) => t.id === teamId);
    if (!team) {
      return;
    }

    onUpdateStats(teamId, team.wins + 1, team.losses, team.points + 10);
  };

  const updateTeamLosses = (teamId) => {
    if (isReadOnly) {
      return;
    }

    const team = teams.find((t) => t.id === teamId);
    if (!team) {
      return;
    }

    onUpdateStats(teamId, team.wins, team.losses + 1, Math.max(0, team.points - 5));
  };

  const handleResetTeam = async (team) => {
    if (isReadOnly) {
      return;
    }

    const confirmed = window.confirm('Reset stats for ' + (team.name || 'this team') + '?');
    if (!confirmed) {
      return;
    }

    await onResetStats(team.id);
  };

  const handleRemoveTeam = async (team) => {
    if (isReadOnly) {
      return;
    }

    const confirmed = window.confirm('Remove ' + (team.name || 'this team') + ' from the leaderboard?');
    if (!confirmed) {
      return;
    }

    await onRemoveTeam(team.id);
  };

  return (
    <div className={'leaderboard' + (allowEditing ? '' : ' leaderboard-readonly')}>
      <h2>Team Standings</h2>

      <div className="leaderboard-table">
        {sortedTeams.map((team, index) => {
          const medal = getMedalMeta(index);
          const isEditing = allowEditing && editingTeamId === team.id;
          const teamName = (team.name || 'Untitled Team').trim();
          const memberLine = formatTeamMembers(team);
          const winRate = calculateWinRate(team.wins, team.losses);
          const rowClassName =
            'player-row' +
            (index < 3 ? ' podium' : '') +
            (allowEditing ? '' : ' player-row-readonly');

          return (
            <div key={team.id} className={rowClassName}>
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
                    <div className="team-edit-grid">
                      <input
                        className="rename-input"
                        value={editingValues.name}
                        onChange={(event) =>
                          setEditingValues((prev) => ({ ...prev, name: event.target.value }))
                        }
                        onKeyDown={(event) => handleRenameKeyDown(event, team)}
                        maxLength={80}
                        placeholder="Team name"
                        autoFocus
                      />
                      <div className="team-edit-members">
                        <input
                          className="rename-input"
                          value={editingValues.playerOne}
                          onChange={(event) =>
                            setEditingValues((prev) => ({ ...prev, playerOne: event.target.value }))
                          }
                          onKeyDown={(event) => handleRenameKeyDown(event, team)}
                          maxLength={50}
                          placeholder="Player one"
                        />
                        <span className="team-edit-separator">&amp;</span>
                        <input
                          className="rename-input"
                          value={editingValues.playerTwo}
                          onChange={(event) =>
                            setEditingValues((prev) => ({ ...prev, playerTwo: event.target.value }))
                          }
                          onKeyDown={(event) => handleRenameKeyDown(event, team)}
                          maxLength={50}
                          placeholder="Player two"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <strong className="player-name" title={teamName}>
                        {teamName}
                      </strong>
                      <span className="team-members-line" aria-label={`Team members: ${memberLine}`}>
                        {memberLine}
                      </span>
                    </>
                  )}

                  <div className="player-meta">
                    <span
                      className="player-record"
                      aria-label={`${team.wins} wins and ${team.losses} losses`}
                    >
                      <span className="wins">{team.wins}</span>
                      <span className="meta-divider">-</span>
                      <span className="losses">{team.losses}</span>
                    </span>
                    <span className="meta-separator" aria-hidden="true">
                      ·
                    </span>
                    <span className="player-rate">{winRate}% WR</span>
                  </div>
                </div>

                <div className="points-col">
                  <span className="points">{team.points}</span>
                  <span className="points-label">pts</span>
                </div>
              </div>

              {allowEditing && (
                <div className="actions-col">
                  {isEditing ? (
                    <>
                      <button
                        className="admin-btn save-btn"
                        onClick={() => submitRename(team)}
                        disabled={
                          renaming ||
                          !editingValues.name.trim() ||
                          !editingValues.playerOne.trim() ||
                          !editingValues.playerTwo.trim()
                        }
                      >
                        {renaming ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        className="admin-btn cancel-btn"
                        onClick={cancelEditingTeam}
                        disabled={renaming}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="win-btn"
                        onClick={() => updateTeamWins(team.id)}
                        title="Record a win"
                      >
                        +W
                      </button>
                      <button
                        className="loss-btn"
                        onClick={() => updateTeamLosses(team.id)}
                        title="Record a loss"
                      >
                        +L
                      </button>
                      <button
                        className="admin-btn rename-btn"
                        onClick={() => startEditingTeam(team)}
                        title="Edit team details"
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn reset-btn"
                        onClick={() => handleResetTeam(team)}
                        title="Reset stats"
                      >
                        Reset
                      </button>
                      <button
                        className="admin-btn remove-btn"
                        onClick={() => handleRemoveTeam(team)}
                        title="Remove team"
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

      {teams.length === 0 && (
        <div className="empty-state">
          <p>No teams yet! Create a team to start tracking doubles matches.</p>
        </div>
      )}
    </div>
  );
};

export default TeamLeaderboard;

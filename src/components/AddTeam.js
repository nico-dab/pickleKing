import React, { useState } from 'react';
import './AddTeam.css';

const AddTeam = ({ onAddTeam }) => {
  const [teamName, setTeamName] = useState('');
  const [playerOne, setPlayerOne] = useState('');
  const [playerTwo, setPlayerTwo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const payload = {
      name: teamName.trim(),
      playerOne: playerOne.trim(),
      playerTwo: playerTwo.trim(),
    };

    if (!payload.name || !payload.playerOne || !payload.playerTwo) {
      return;
    }

    setSubmitting(true);
    const success = await onAddTeam(payload);

    if (success) {
      setTeamName('');
      setPlayerOne('');
      setPlayerTwo('');
    }

    setSubmitting(false);
  };

  const canSubmit =
    teamName.trim().length > 0 &&
    playerOne.trim().length > 0 &&
    playerTwo.trim().length > 0 &&
    !submitting;

  return (
    <div className="add-team">
      <h3>Create New Team</h3>
      <form className="add-team-form" onSubmit={handleSubmit}>
        <div className="add-team-field">
          <label htmlFor="team-name">Team name</label>
          <input
            id="team-name"
            type="text"
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            placeholder="Enter team name..."
            maxLength={60}
            disabled={submitting}
          />
        </div>
        <div className="add-team-field">
          <label htmlFor="team-player-one">Player one</label>
          <input
            id="team-player-one"
            type="text"
            value={playerOne}
            onChange={(event) => setPlayerOne(event.target.value)}
            placeholder="First teammate"
            maxLength={50}
            disabled={submitting}
          />
        </div>
        <div className="add-team-field">
          <label htmlFor="team-player-two">Player two</label>
          <input
            id="team-player-two"
            type="text"
            value={playerTwo}
            onChange={(event) => setPlayerTwo(event.target.value)}
            placeholder="Second teammate"
            maxLength={50}
            disabled={submitting}
          />
        </div>
        <div className="add-team-actions">
          <button type="submit" disabled={!canSubmit}>
            {submitting ? 'Adding...' : 'Add Team'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeam;

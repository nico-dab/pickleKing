import React, { useState } from 'react';
import './AddPlayer.css';

const AddPlayer = ({ onAddPlayer }) => {
  const [playerName, setPlayerName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName.trim() || submitting) {
      return;
    }

    setSubmitting(true);
    const success = await onAddPlayer(playerName.trim());

    if (success) {
      setPlayerName('');
    }

    setSubmitting(false);
  };

  return (
    <div className="add-player">
      <h3>Add New Player</h3>
      <form onSubmit={handleSubmit} className="add-player-form">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name..."
          className="player-input"
          maxLength={50}
          disabled={submitting}
        />
        <button type="submit" disabled={!playerName.trim() || submitting}>
          {submitting ? 'Adding...' : 'Add Player'}
        </button>
      </form>
    </div>
  );
};

export default AddPlayer;

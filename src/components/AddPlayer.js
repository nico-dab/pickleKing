import React, { useState } from 'react';
import './AddPlayer.css';

const AddPlayer = ({ onAddPlayer }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onAddPlayer(playerName.trim());
      setPlayerName('');
    }
  };

  return (
    <div className="add-player">
      <h3>➕ Add New Player</h3>
      <form onSubmit={handleSubmit} className="add-player-form">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name..."
          className="player-input"
          maxLength={50}
        />
        <button type="submit" disabled={!playerName.trim()}>
          Add Player
        </button>
      </form>
    </div>
  );
};

export default AddPlayer;
import React, { useState } from 'react';
import './App.css';
import Leaderboard from './components/Leaderboard';
import AddPlayer from './components/AddPlayer';

function App() {
  const [players, setPlayers] = useState([
    { id: 1, name: 'John Doe', wins: 15, losses: 3, points: 147 },
    { id: 2, name: 'Jane Smith', wins: 12, losses: 6, points: 126 },
    { id: 3, name: 'Mike Johnson', wins: 8, losses: 10, points: 98 },
    { id: 4, name: 'Sarah Wilson', wins: 10, losses: 8, points: 110 }
  ]);

  const addPlayer = (playerName) => {
    const newPlayer = {
      id: Date.now(),
      name: playerName,
      wins: 0,
      losses: 0,
      points: 0
    };
    setPlayers([...players, newPlayer]);
  };

  const updatePlayerStats = (playerId, wins, losses, points) => {
    setPlayers(players.map(player => 
      player.id === playerId 
        ? { ...player, wins, losses, points }
        : player
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏓 Pickleball Leaderboard</h1>
        <p>Track your coworker pickleball matches and rankings!</p>
      </header>
      
      <main className="App-main">
        <AddPlayer onAddPlayer={addPlayer} />
        <Leaderboard 
          players={players} 
          onUpdateStats={updatePlayerStats} 
        />
      </main>
    </div>
  );
}

export default App;
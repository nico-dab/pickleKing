import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import Leaderboard from './components/Leaderboard';
import AddPlayer from './components/AddPlayer';
import { supabase } from './supabaseClient';

function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('players')
      .select('*')
      .order('points', { ascending: false })
      .order('wins', { ascending: false });

    if (fetchError) {
      setError('Unable to load players from Supabase.');
      setPlayers([]);
    } else {
      setPlayers(data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const addPlayer = async (playerName) => {
    setError(null);

    const { data, error: insertError } = await supabase
      .from('players')
      .insert([{ name: playerName, wins: 0, losses: 0, points: 0 }])
      .select()
      .single();

    if (insertError) {
      setError('Unable to add player. Please try again.');
      return false;
    }

    setPlayers((prev) => [...prev, data]);
    return true;
  };

  const updatePlayerStats = async (playerId, wins, losses, points) => {
    setError(null);

    const { error: updateError } = await supabase
      .from('players')
      .update({ wins, losses, points })
      .eq('id', playerId);

    if (updateError) {
      setError('Unable to update player stats. Please retry.');
      return false;
    }

    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId ? { ...player, wins, losses, points } : player
      )
    );

    return true;
  };

  const resetPlayerStats = async (playerId) => {
    setError(null);

    const { error: resetError } = await supabase
      .from('players')
      .update({ wins: 0, losses: 0, points: 0 })
      .eq('id', playerId);

    if (resetError) {
      setError('Unable to reset stats. Please retry.');
      return false;
    }

    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, wins: 0, losses: 0, points: 0 }
          : player
      )
    );

    return true;
  };
  const removePlayer = async (playerId) => {
    setError(null);

    const { error: deleteError, count } = await supabase
      .from('players')
      .delete({ count: 'exact' })
      .eq('id', playerId);

    if (deleteError || (typeof count === 'number' && count === 0)) {
      setError('Unable to remove player. Please retry.');
      await fetchPlayers();
      return false;
    }

    setPlayers((prev) => prev.filter((player) => player.id !== playerId));
    return true;
  };

  const renamePlayer = async (playerId, name) => {
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      return false;
    }

    const { error: renameError } = await supabase
      .from('players')
      .update({ name: trimmedName })
      .eq('id', playerId);

    if (renameError) {
      setError('Unable to rename player. Please retry.');
      return false;
    }

    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId ? { ...player, name: trimmedName } : player
      )
    );

    return true;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>pickleKing Leaderboard</h1>
        <p>Track your coworker pickleball matches and rankings!</p>
      </header>

      <main className="App-main">
        {error && <div className="error-message">{error}</div>}
        <AddPlayer onAddPlayer={addPlayer} />
        {loading ? (
          <div className="loading-state">Loading players...</div>
        ) : (
          <Leaderboard
            players={players}
            onUpdateStats={updatePlayerStats}
            onResetStats={resetPlayerStats}
            onRemovePlayer={removePlayer}
            onRenamePlayer={renamePlayer}
          />
        )}
      </main>
    </div>
  );
}

export default App;


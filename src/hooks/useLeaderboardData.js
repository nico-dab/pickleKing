import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function useLeaderboardData({
  tableName,
  formatInsertInput,
  formatRenameInput,
  messages = {},
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    load: loadErrorMessage = 'Unable to load records. Please retry.',
    add: addErrorMessage = 'Unable to add entry. Please retry.',
    update: updateErrorMessage = 'Unable to update entry. Please retry.',
    reset: resetErrorMessage = 'Unable to reset entry. Please retry.',
    remove: removeErrorMessage = 'Unable to remove entry. Please retry.',
    rename: renameErrorMessage = 'Unable to rename entry. Please retry.',
  } = messages;

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from(tableName)
      .select('*')
      .order('points', { ascending: false })
      .order('wins', { ascending: false });

    if (fetchError) {
      setError(loadErrorMessage);
      setItems([]);
    } else {
      setItems(data ?? []);
    }

    setLoading(false);
  }, [tableName, loadErrorMessage]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(
    async (input) => {
      const payload = formatInsertInput(input);
      if (!payload) {
        return false;
      }

      setError(null);

      const { data, error: insertError } = await supabase
        .from(tableName)
        .insert([payload])
        .select()
        .single();

      if (insertError) {
        setError(addErrorMessage);
        return false;
      }

      setItems((prev) => [...prev, data]);
      return true;
    },
    [tableName, formatInsertInput, addErrorMessage]
  );

  const updateStats = useCallback(
    async (itemId, wins, losses, points) => {
      setError(null);

      const { error: updateError } = await supabase
        .from(tableName)
        .update({ wins, losses, points })
        .eq('id', itemId);

      if (updateError) {
        setError(updateErrorMessage);
        return false;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, wins, losses, points } : item
        )
      );

      return true;
    },
    [tableName, updateErrorMessage]
  );

  const resetStats = useCallback(
    async (itemId) => {
      setError(null);

      const { error: resetError } = await supabase
        .from(tableName)
        .update({ wins: 0, losses: 0, points: 0 })
        .eq('id', itemId);

      if (resetError) {
        setError(resetErrorMessage);
        return false;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, wins: 0, losses: 0, points: 0 }
            : item
        )
      );

      return true;
    },
    [tableName, resetErrorMessage]
  );

  const removeItem = useCallback(
    async (itemId) => {
      setError(null);

      const { error: deleteError, count } = await supabase
        .from(tableName)
        .delete({ count: 'exact' })
        .eq('id', itemId);

      if (deleteError || (typeof count === 'number' && count === 0)) {
        setError(removeErrorMessage);
        await fetchItems();
        return false;
      }

      setItems((prev) => prev.filter((item) => item.id !== itemId));
      return true;
    },
    [tableName, removeErrorMessage, fetchItems]
  );

  const renameItem = useCallback(
    async (itemId, input) => {
      const payload = formatRenameInput(input);
      if (!payload) {
        return false;
      }

      setError(null);

      const { error: renameError } = await supabase
        .from(tableName)
        .update(payload)
        .eq('id', itemId);

      if (renameError) {
        setError(renameErrorMessage);
        return false;
      }

      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, ...payload } : item))
      );

      return true;
    },
    [tableName, formatRenameInput, renameErrorMessage]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    items,
    loading,
    error,
    refresh: fetchItems,
    clearError,
    addItem,
    updateStats,
    resetStats,
    removeItem,
    renameItem,
  };
}

export function usePlayersLeaderboard() {
  return useLeaderboardData({
    tableName: 'players',
    messages: {
      load: 'Unable to load players from Supabase.',
      add: 'Unable to add player. Please try again.',
      update: 'Unable to update player stats. Please retry.',
      reset: 'Unable to reset stats. Please retry.',
      remove: 'Unable to remove player. Please retry.',
      rename: 'Unable to rename player. Please retry.',
    },
    formatInsertInput: (name) => {
      const trimmed = typeof name === 'string' ? name.trim() : '';
      if (!trimmed) {
        return null;
      }
      return { name: trimmed, wins: 0, losses: 0, points: 0 };
    },
    formatRenameInput: (name) => {
      const trimmed = typeof name === 'string' ? name.trim() : '';
      return trimmed ? { name: trimmed } : null;
    },
  });
}

export function useTeamsLeaderboard() {
  return useLeaderboardData({
    tableName: 'teams',
    messages: {
      load: 'Unable to load teams from Supabase.',
      add: 'Unable to add team. Please try again.',
      update: 'Unable to update team stats. Please retry.',
      reset: 'Unable to reset stats. Please retry.',
      remove: 'Unable to remove team. Please retry.',
      rename: 'Unable to update team details. Please retry.',
    },
    formatInsertInput: (team) => {
      if (!team || typeof team !== 'object') {
        return null;
      }

      const name = (team.name ?? '').trim();
      const playerOne = (team.playerOne ?? '').trim();
      const playerTwo = (team.playerTwo ?? '').trim();

      if (!name || !playerOne || !playerTwo) {
        return null;
      }

      return {
        name,
        player_one: playerOne,
        player_two: playerTwo,
        wins: 0,
        losses: 0,
        points: 0,
      };
    },
    formatRenameInput: (team) => {
      if (!team || typeof team !== 'object') {
        return null;
      }

      const name = (team.name ?? '').trim();
      const playerOne = (team.playerOne ?? '').trim();
      const playerTwo = (team.playerTwo ?? '').trim();

      if (!name || !playerOne || !playerTwo) {
        return null;
      }

      return {
        name,
        player_one: playerOne,
        player_two: playerTwo,
      };
    },
  });
}

export default useLeaderboardData;

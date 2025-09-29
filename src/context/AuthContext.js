import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  isAdmin: false,
  authError: null,
  signInWithOAuth: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  clearAuthError: () => {},
});

function computeIsAdmin(user) {
  if (!user) {
    return false;
  }

  const { app_metadata: appMeta = {}, user_metadata: userMeta = {} } = user;

  if (Array.isArray(appMeta.roles) && appMeta.roles.includes('admin')) {
    return true;
  }

  if (appMeta.is_admin === true || appMeta.isAdmin === true) {
    return true;
  }

  if (userMeta.is_admin === true || userMeta.isAdmin === true) {
    return true;
  }

  return false;
}

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }

      if (error) {
        setAuthError(error.message ?? 'Unable to retrieve session.');
      }

      setSession(data?.session ?? null);
      setUser(data?.session?.user ?? null);
      setLoading(false);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (event === 'SIGNED_OUT') {
        setAuthError(null);
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithOAuth = useCallback(async (provider = 'github') => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setAuthError(error.message ?? 'Unable to sign in.');
      return { error };
    }

    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error.message ?? 'Unable to sign out.');
      return { error };
    }

    setAuthError(null);
    return { error: null };
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      isAdmin: computeIsAdmin(user),
      authError,
      signInWithOAuth,
      signOut,
      clearAuthError,
    }),
    [session, user, loading, authError, signInWithOAuth, signOut, clearAuthError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

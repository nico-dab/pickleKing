import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying magic link...');

  useEffect(() => {
    let isMounted = true;

    async function handleCallback() {
      const currentUrl = new URL(window.location.href);
      const code = currentUrl.searchParams.get('code');
      const hash = window.location.hash.startsWith('#')
        ? new URLSearchParams(window.location.hash.slice(1))
        : null;

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            throw error;
          }
        } else if (hash && hash.get('access_token') && hash.get('refresh_token')) {
          const { error } = await supabase.auth.setSession({
            access_token: hash.get('access_token'),
            refresh_token: hash.get('refresh_token'),
          });
          if (error) {
            throw error;
          }
        } else {
          throw new Error('No verification code found in URL.');
        }

        window.history.replaceState({}, document.title, currentUrl.origin + currentUrl.pathname);

        if (!isMounted) {
          return;
        }

        setStatus('Magic link verified. Redirecting...');
        navigate('/admin/singles', { replace: true });
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setStatus(error.message ?? 'Unable to verify magic link.');
        setTimeout(() => navigate('/admin/login', { replace: true }), 2500);
      }
    }

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="App-section auth-section">
      <div className="auth-card">
        <h2>Signing you in</h2>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;

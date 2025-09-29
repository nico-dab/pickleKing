import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithOAuth, authError, clearAuthError, user, isAdmin } = useAuth();

  useEffect(() => {
    if (user && isAdmin) {
      const from = location.state?.from?.pathname ?? '/admin/singles';
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, navigate, location.state]);

  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const handleGitHubLogin = async () => {
    await signInWithOAuth('github');
  };

  return (
    <div className="App-section auth-section">
      <div className="auth-card">
        <h2>Admin Access</h2>
        <p className="auth-subtitle">
          Sign in with your GitHub account that has admin privileges.
        </p>
        <button className="auth-button" type="button" onClick={handleGitHubLogin}>
          Continue with GitHub
        </button>
        {authError && <div className="auth-error">{authError}</div>}
      </div>
    </div>
  );
};

export default AdminLoginPage;

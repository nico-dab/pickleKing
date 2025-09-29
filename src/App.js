import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  BrowserRouter as Router,
  NavLink,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import './App.css';
import { siteDescription, siteTitle } from './config/siteConfig';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminSinglesPage from './pages/admin/AdminSinglesPage';
import AdminTeamsPage from './pages/admin/AdminTeamsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminUnauthorizedPage from './pages/admin/AdminUnauthorizedPage';
import AuthCallbackPage from './pages/admin/AuthCallbackPage';
import PublicSinglesPage from './pages/public/PublicSinglesPage';
import PublicTeamsPage from './pages/public/PublicTeamsPage';
import ProtectedRoute from './routes/ProtectedRoute';

const AppRoutes = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [showHiddenAdminLink, setShowHiddenAdminLink] = useState(false);
  const longPressTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const handleSignOut = async () => {
    await signOut();
  };

  const adminLandingPath = !user
    ? '/admin/login'
    : isAdmin
    ? '/admin/singles'
    : '/admin/unauthorized';

  // Show the hidden admin link for 10 seconds
  const showAdminLink = useCallback(() => {
    setShowHiddenAdminLink(true);
    
    // Clear any existing hide timer
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    
    // Auto-hide after 10 seconds
    hideTimerRef.current = setTimeout(() => {
      setShowHiddenAdminLink(false);
    }, 10000);
  }, []);

  // Handle double-click for desktop
  const handleTitleClick = useCallback(() => {
    clickCountRef.current += 1;
    
    if (clickCountRef.current === 1) {
      // First click - start timer for double-click detection
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 300);
    } else if (clickCountRef.current === 2) {
      // Double-click detected
      clearTimeout(clickTimerRef.current);
      clickCountRef.current = 0;
      showAdminLink();
    }
  }, [showAdminLink]);



  // Handle long-press for mobile
  const handleTouchStart = useCallback(() => {
    longPressTimerRef.current = setTimeout(() => {
      showAdminLink();
    }, 800); // 800ms long press
  }, [showAdminLink]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    // Cancel long press if user moves finger
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 
          className="App-title"
          onClick={handleTitleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          title="Double-click or long-press for admin access"
        >
          {siteTitle}
        </h1>
        <p>{siteDescription}</p>
        <nav className="App-nav">
          <NavLink
            to="/leaderboard/singles"
            className={({ isActive }) =>
              'App-nav-link' + (isActive ? ' App-nav-link-active' : '')
            }
          >
            Singles
          </NavLink>
          <NavLink
            to="/leaderboard/teams"
            className={({ isActive }) =>
              'App-nav-link' + (isActive ? ' App-nav-link-active' : '')
            }
          >
            Teams
          </NavLink>
          {isAdmin && (
            <>
              <NavLink
                to="/admin/singles"
                className={({ isActive }) =>
                  'App-nav-link' + (isActive ? ' App-nav-link-active' : '')
                }
              >
                Admin Singles
              </NavLink>
              <NavLink
                to="/admin/teams"
                className={({ isActive }) =>
                  'App-nav-link' + (isActive ? ' App-nav-link-active' : '')
                }
              >
                Admin Teams
              </NavLink>
            </>
          )}
          {!user && showHiddenAdminLink && (
            <NavLink
              to="/admin/login"
              className={({ isActive }) =>
                'App-nav-link hidden-admin-link' + (isActive ? ' App-nav-link-active' : '')
              }
            >
              Admin Login
            </NavLink>
          )}
          {user && !isAdmin && (
            <NavLink
              to="/admin/unauthorized"
              className={({ isActive }) =>
                'App-nav-link' + (isActive ? ' App-nav-link-active' : '')
              }
            >
              Admin Access
            </NavLink>
          )}
          {user && (
            <button
              className="App-nav-link App-nav-button"
              type="button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          )}
        </nav>
      </header>

      <main className="App-main">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/leaderboard/singles" replace />}
          />
          <Route
            path="/leaderboard/singles"
            element={<PublicSinglesPage />}
          />
          <Route
            path="/leaderboard/teams"
            element={<PublicTeamsPage />}
          />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/unauthorized"
            element={<AdminUnauthorizedPage />}
          />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route
            path="/admin"
            element={<Navigate to={adminLandingPath} replace />}
          />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/singles" element={<AdminSinglesPage />} />
            <Route path="/admin/teams" element={<AdminTeamsPage />} />
          </Route>
          <Route
            path="*"
            element={<Navigate to="/leaderboard/singles" replace />}
          />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
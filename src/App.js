import React from 'react';
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

  const handleSignOut = async () => {
    await signOut();
  };

  const adminLandingPath = !user
    ? '/admin/login'
    : isAdmin
    ? '/admin/singles'
    : '/admin/unauthorized';

  return (
    <div className="App">
      <header className="App-header">
        <h1>{siteTitle}</h1>
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
          {!user && (
            <NavLink
              to="/admin/login"
              className={({ isActive }) =>
                'App-nav-link' + (isActive ? ' App-nav-link-active' : '')
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
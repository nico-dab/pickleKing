import React from 'react';
import {
  BrowserRouter as Router,
  NavLink,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import './App.css';
import { isAdminSite } from './config/siteConfig';
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

  const singlesPath = isAdminSite ? '/admin/singles' : '/';
  const teamsPath = isAdminSite ? '/admin/teams' : '/leaderboard/teams';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>pickleKing</h1>
        <p>Coworker pickleball rankings at a glance.</p>
        <nav className="App-nav">
          <NavLink
            to={singlesPath}
            className={({ isActive }) =>
              'App-nav-link' + (isActive ? ' App-nav-link-active' : '')
            }
          >
            Singles
          </NavLink>
          <NavLink
            to={teamsPath}
            className={({ isActive }) =>
              'App-nav-link' + (isActive ? ' App-nav-link-active' : '')
            }
          >
            Teams
          </NavLink>
          {isAdminSite && (
            <NavLink
              to="/"
              className={({ isActive }) =>
                'App-nav-link' + (isActive ? ' App-nav-link-active' : '')
              }
            >
              Public View
            </NavLink>
          )}
          {isAdminSite && (
            user ? (
              <button className="App-nav-link App-nav-button" type="button" onClick={handleSignOut}>
                Sign out
              </button>
            ) : (
              <NavLink
                to="/admin/login"
                className={({ isActive }) =>
                  'App-nav-link' + (isActive ? ' App-nav-link-active' : '')
                }
              >
                Admin Login
              </NavLink>
            )
          )}
        </nav>
      </header>

      <main className="App-main">
        <Routes>
          {isAdminSite ? (
            <>
              <Route
                path="/"
                element={
                  <Navigate
                    to={user && isAdmin ? '/admin/singles' : '/admin/login'}
                    replace
                  />
                }
              />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/unauthorized" element={<AdminUnauthorizedPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin/singles" element={<AdminSinglesPage />} />
                <Route path="/admin/teams" element={<AdminTeamsPage />} />
              </Route>
              <Route path="/leaderboard/singles" element={<PublicSinglesPage />} />
              <Route path="/leaderboard/teams" element={<PublicTeamsPage />} />
              <Route
                path="*"
                element={
                  <Navigate
                    to={user && isAdmin ? '/admin/singles' : '/admin/login'}
                    replace
                  />
                }
              />
            </>
          ) : (
            <>
              <Route path="/" element={<PublicSinglesPage />} />
              <Route path="/leaderboard/singles" element={<PublicSinglesPage />} />
              <Route path="/leaderboard/teams" element={<PublicTeamsPage />} />
              <Route path="/admin/*" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
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


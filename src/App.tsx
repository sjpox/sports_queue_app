import { useEffect } from 'react';
import { NavLink, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import PlayersPage from './pages/PlayersPage';
import CourtsPage from './pages/CourtsPage';
import SessionsPage from './pages/SessionsPage';
import SessionDetailPage from './pages/SessionDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequireAuth from './components/RequireAuth';
import { useAppDispatch, useAppSelector } from './store';
import {
  fetchMe,
  logout,
  setBootstrapped,
} from './features/auth/authSlice';
import { setUnauthorizedHandler, tokenStore } from './api/client';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-200'
  }`;

export default function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      dispatch(logout());
      navigate('/login', { replace: true });
    });
  }, [dispatch, navigate]);

  useEffect(() => {
    if (tokenStore.get()) {
      void dispatch(fetchMe());
    } else {
      dispatch(setBootstrapped(true));
    }
  }, [dispatch]);

  const onLogout = (): void => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-emerald-700">Sports Queue</h1>

          {user ? (
            <>
              <nav className="flex gap-2">
                <NavLink to="/players" className={linkClass}>Players</NavLink>
                <NavLink to="/courts" className={linkClass}>Courts</NavLink>
                <NavLink to="/sessions" className={linkClass}>Sessions</NavLink>
              </nav>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-600 hidden sm:inline">
                  {user.name}{' '}
                  <span className="text-xs text-slate-400">({user.role})</span>
                </span>
                <button
                  onClick={onLogout}
                  className="text-slate-700 hover:text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <nav className="flex gap-2">
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/register" className={linkClass}>Register</NavLink>
            </nav>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/players"
            element={
              <RequireAuth>
                <PlayersPage />
              </RequireAuth>
            }
          />
          <Route
            path="/courts"
            element={
              <RequireAuth>
                <CourtsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/sessions"
            element={
              <RequireAuth>
                <SessionsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/sessions/:id"
            element={
              <RequireAuth>
                <SessionDetailPage />
              </RequireAuth>
            }
          />
          <Route path="/" element={<Navigate to="/players" replace />} />
          <Route path="*" element={<Navigate to="/players" replace />} />
        </Routes>
      </main>
    </div>
  );
}

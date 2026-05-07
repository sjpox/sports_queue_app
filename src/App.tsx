import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import PlayersPage from './pages/PlayersPage';
import CourtsPage from './pages/CourtsPage';
import SessionsPage from './pages/SessionsPage';
import SessionDetailPage from './pages/SessionDetailPage';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-200'
  }`;

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-700">Sports Queue</h1>
          <nav className="flex gap-2">
            <NavLink to="/players" className={linkClass}>Players</NavLink>
            <NavLink to="/courts" className={linkClass}>Courts</NavLink>
            <NavLink to="/sessions" className={linkClass}>Sessions</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/players" replace />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/courts" element={<CourtsPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/sessions/:id" element={<SessionDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSessions, createSession } from '../features/sessions/sessionsSlice';
import { fetchPlayers } from '../features/players/playersSlice';
import { fetchCourts } from '../features/courts/courtsSlice';

const today = () => new Date().toISOString().slice(0, 10);

export default function SessionsPage() {
  const dispatch = useDispatch();
  const sessions = useSelector((s) => s.sessions.items);
  const players = useSelector((s) => s.players.items);
  const courts = useSelector((s) => s.courts.items);

  const [form, setForm] = useState({
    session_date: today(), sport: 'badminton', hours: 2,
    shuttle_cost: 0, misc_cost: 0, court_ids: [], player_ids: [],
  });

  useEffect(() => {
    dispatch(fetchSessions());
    dispatch(fetchPlayers());
    dispatch(fetchCourts());
  }, [dispatch]);

  const toggle = (key, id) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(id) ? f[key].filter((x) => x !== id) : [...f[key], id],
    }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, hours: Number(form.hours), shuttle_cost: Number(form.shuttle_cost), misc_cost: Number(form.misc_cost) };
    await dispatch(createSession(payload));
    dispatch(fetchSessions());
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">New session</h2>
        <form onSubmit={onSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="text-slate-600">Date</span>
              <input type="date" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                value={form.session_date}
                onChange={(e) => setForm({ ...form, session_date: e.target.value })} />
            </label>
            <label className="text-sm">
              <span className="text-slate-600">Sport</span>
              <select className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })}>
                <option value="badminton">badminton</option>
                <option value="pickleball">pickleball</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="text-slate-600">Hours</span>
              <input type="number" step="0.5" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
            </label>
            <label className="text-sm">
              <span className="text-slate-600">Shuttle / ball cost</span>
              <input type="number" step="0.01" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                value={form.shuttle_cost} onChange={(e) => setForm({ ...form, shuttle_cost: e.target.value })} />
            </label>
            <label className="text-sm col-span-2">
              <span className="text-slate-600">Misc cost</span>
              <input type="number" step="0.01" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                value={form.misc_cost} onChange={(e) => setForm({ ...form, misc_cost: e.target.value })} />
            </label>
          </div>

          <fieldset>
            <legend className="text-sm text-slate-600 mb-1">Courts</legend>
            <div className="flex flex-wrap gap-2">
              {courts.map((c) => (
                <label key={c.id} className={`text-sm px-3 py-1 rounded-full border cursor-pointer ${form.court_ids.includes(c.id) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-300'}`}>
                  <input type="checkbox" className="hidden" checked={form.court_ids.includes(c.id)}
                    onChange={() => toggle('court_ids', c.id)} />
                  {c.name}
                </label>
              ))}
              {courts.length === 0 && <span className="text-slate-400 text-sm">No courts. Add some first.</span>}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm text-slate-600 mb-1">Players attending</legend>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {players.filter((p) => p.active).map((p) => (
                <label key={p.id} className={`text-sm px-3 py-1 rounded-full border cursor-pointer ${form.player_ids.includes(p.id) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-300'}`}>
                  <input type="checkbox" className="hidden" checked={form.player_ids.includes(p.id)}
                    onChange={() => toggle('player_ids', p.id)} />
                  {p.name}
                </label>
              ))}
            </div>
          </fieldset>

          <button className="w-full bg-emerald-600 text-white rounded-md px-4 py-2 hover:bg-emerald-700">
            Create session
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent sessions</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
          {sessions.map((s) => (
            <Link key={s.id} to={`/sessions/${s.id}`} className="block px-4 py-3 hover:bg-slate-50">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{s.session_date} · {s.sport}</div>
                  <div className="text-xs text-slate-500">{Number(s.hours)}h · shuttle {Number(s.shuttle_cost).toFixed(2)} · misc {Number(s.misc_cost).toFixed(2)}</div>
                </div>
                <span className="text-emerald-700 text-sm">View →</span>
              </div>
            </Link>
          ))}
          {sessions.length === 0 && (
            <div className="text-center py-8 text-slate-400">No sessions yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

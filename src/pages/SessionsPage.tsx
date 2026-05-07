import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchSessions,
  createSession,
  type SessionInput,
} from '../features/sessions/sessionsSlice';
import { fetchPlayers } from '../features/players/playersSlice';
import { fetchCourts } from '../features/courts/courtsSlice';
import type { SessionSport } from '../types';

const today = (): string => new Date().toISOString().slice(0, 10);

export default function SessionsPage() {
  const dispatch = useAppDispatch();
  const sessions = useAppSelector((s) => s.sessions.items);
  const players = useAppSelector((s) => s.players.items);
  const courts = useAppSelector((s) => s.courts.items);

  const [form, setForm] = useState<SessionInput>({
    sessionDate: today(),
    sport: 'badminton',
    hours: 2,
    shuttleCost: 0,
    miscCost: 0,
    courtIds: [],
    playerIds: [],
  });

  useEffect(() => {
    dispatch(fetchSessions());
    dispatch(fetchPlayers());
    dispatch(fetchCourts());
  }, [dispatch]);

  const toggle = (key: 'courtIds' | 'playerIds', id: number) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(id) ? f[key].filter((x) => x !== id) : [...f[key], id],
    }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(createSession(form));
    dispatch(fetchSessions());
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">New session</h2>
        <form
          onSubmit={onSubmit}
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="text-slate-600">Date</span>
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                value={form.sessionDate}
                onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
              />
            </label>
            <label className="text-sm">
              <span className="text-slate-600">Sport</span>
              <select
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                value={form.sport}
                onChange={(e) => setForm({ ...form, sport: e.target.value as SessionSport })}
              >
                <option value="badminton">badminton</option>
                <option value="pickleball">pickleball</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="text-slate-600">Hours</span>
              <input
                type="number"
                step="0.5"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })}
              />
            </label>
            <label className="text-sm">
              <span className="text-slate-600">Shuttle / ball cost</span>
              <input
                type="number"
                step="0.01"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                value={form.shuttleCost}
                onChange={(e) => setForm({ ...form, shuttleCost: Number(e.target.value) })}
              />
            </label>
            <label className="text-sm col-span-2">
              <span className="text-slate-600">Misc cost</span>
              <input
                type="number"
                step="0.01"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                value={form.miscCost}
                onChange={(e) => setForm({ ...form, miscCost: Number(e.target.value) })}
              />
            </label>
          </div>

          <fieldset>
            <legend className="text-sm text-slate-600 mb-1">Courts</legend>
            <div className="flex flex-wrap gap-2">
              {courts.map((c) => (
                <label
                  key={c.id}
                  className={`text-sm px-3 py-1 rounded-full border cursor-pointer ${
                    form.courtIds.includes(c.id)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={form.courtIds.includes(c.id)}
                    onChange={() => toggle('courtIds', c.id)}
                  />
                  {c.name}
                </label>
              ))}
              {courts.length === 0 && (
                <span className="text-slate-400 text-sm">No courts. Add some first.</span>
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm text-slate-600 mb-1">Players attending</legend>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {players
                .filter((p) => p.active)
                .map((p) => (
                  <label
                    key={p.id}
                    className={`text-sm px-3 py-1 rounded-full border cursor-pointer ${
                      form.playerIds.includes(p.id)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={form.playerIds.includes(p.id)}
                      onChange={() => toggle('playerIds', p.id)}
                    />
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
            <Link
              key={s.id}
              to={`/sessions/${s.id}`}
              className="block px-4 py-3 hover:bg-slate-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {String(s.sessionDate).slice(0, 10)} · {s.sport}
                  </div>
                  <div className="text-xs text-slate-500">
                    {Number(s.hours)}h · shuttle {Number(s.shuttleCost).toFixed(2)} · misc{' '}
                    {Number(s.miscCost).toFixed(2)}
                  </div>
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

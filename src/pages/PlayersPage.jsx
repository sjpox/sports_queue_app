import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPlayers, addPlayer, updatePlayer, deletePlayer,
} from '../features/players/playersSlice';

const SPORTS = ['both', 'pickleball', 'badminton'];
const empty = { name: '', sport: 'both', skill_level: 3, active: 1 };

export default function PlayersPage() {
  const dispatch = useDispatch();
  const players = useSelector((s) => s.players.items);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  useEffect(() => { dispatch(fetchPlayers()); }, [dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editId) dispatch(updatePlayer({ id: editId, ...form }));
    else dispatch(addPlayer(form));
    setForm(empty);
    setEditId(null);
  };

  const startEdit = (p) => { setEditId(p.id); setForm({ name: p.name, sport: p.sport, skill_level: p.skill_level, active: p.active }); };
  const cancelEdit = () => { setEditId(null); setForm(empty); };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Players</h2>
      <form onSubmit={onSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 grid grid-cols-1 sm:grid-cols-5 gap-3">
        <input
          className="input col-span-2 rounded-md border border-slate-300 px-3 py-2"
          placeholder="Player name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <select
          className="rounded-md border border-slate-300 px-3 py-2"
          value={form.sport}
          onChange={(e) => setForm({ ...form, sport: e.target.value })}
        >
          {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className="rounded-md border border-slate-300 px-3 py-2"
          value={form.skill_level}
          onChange={(e) => setForm({ ...form, skill_level: Number(e.target.value) })}
        >
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>Skill {n}</option>)}
        </select>
        <div className="flex gap-2">
          <button className="bg-emerald-600 text-white rounded-md px-4 py-2 hover:bg-emerald-700">
            {editId ? 'Save' : 'Add'}
          </button>
          {editId && <button type="button" onClick={cancelEdit} className="px-3 py-2 text-slate-600">Cancel</button>}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Sport</th>
              <th className="text-left px-4 py-2">Skill</th>
              <th className="text-left px-4 py-2">Active</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2 capitalize">{p.sport}</td>
                <td className="px-4 py-2">{'★'.repeat(p.skill_level)}<span className="text-slate-300">{'★'.repeat(5 - p.skill_level)}</span></td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                    {p.active ? 'active' : 'inactive'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right space-x-3">
                  <button className="text-emerald-700 hover:underline" onClick={() => startEdit(p)}>Edit</button>
                  <button className="text-red-600 hover:underline" onClick={() => dispatch(deletePlayer(p.id))}>Delete</button>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">No players yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

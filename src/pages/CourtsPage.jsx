import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCourts, addCourt, updateCourt, deleteCourt,
} from '../features/courts/courtsSlice';

const STATUSES = ['available', 'in_use', 'closed'];
const SPORTS = ['both', 'pickleball', 'badminton'];
const empty = { name: '', sport: 'both', status: 'available', hourly_rate: 0 };

export default function CourtsPage() {
  const dispatch = useDispatch();
  const courts = useSelector((s) => s.courts.items);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  useEffect(() => { dispatch(fetchCourts()); }, [dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editId) dispatch(updateCourt({ id: editId, ...form }));
    else dispatch(addCourt(form));
    setForm(empty);
    setEditId(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Courts</h2>
      <form onSubmit={onSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 grid grid-cols-1 sm:grid-cols-5 gap-3">
        <input className="rounded-md border border-slate-300 px-3 py-2 col-span-2" placeholder="Court name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="rounded-md border border-slate-300 px-3 py-2" value={form.sport}
          onChange={(e) => setForm({ ...form, sport: e.target.value })}>
          {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="rounded-md border border-slate-300 px-3 py-2" value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="number" step="0.01" className="rounded-md border border-slate-300 px-3 py-2"
          placeholder="Hourly rate"
          value={form.hourly_rate} onChange={(e) => setForm({ ...form, hourly_rate: Number(e.target.value) })} />
        <button className="bg-emerald-600 text-white rounded-md px-4 py-2 hover:bg-emerald-700 sm:col-span-5">
          {editId ? 'Save changes' : 'Add court'}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Sport</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Rate / hr</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {courts.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium">{c.name}</td>
                <td className="px-4 py-2 capitalize">{c.sport}</td>
                <td className="px-4 py-2 capitalize">{c.status.replace('_', ' ')}</td>
                <td className="px-4 py-2">{Number(c.hourly_rate).toFixed(2)}</td>
                <td className="px-4 py-2 text-right space-x-3">
                  <button className="text-emerald-700 hover:underline"
                    onClick={() => { setEditId(c.id); setForm({ name: c.name, sport: c.sport, status: c.status, hourly_rate: c.hourly_rate }); }}>
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline" onClick={() => dispatch(deleteCourt(c.id))}>Delete</button>
                </td>
              </tr>
            ))}
            {courts.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">No courts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { register } from '../features/auth/authSlice';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((s) => s.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) return <Navigate to="/players" replace />;

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
    void dispatch(register({ name, email, password }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-emerald-700">Create account</h2>

        <label className="block text-sm">
          <span className="text-slate-600">Name</span>
          <input
            required
            autoFocus
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="block text-sm">
          <span className="text-slate-600">Email</span>
          <input
            type="email"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block text-sm">
          <span className="text-slate-600">Password</span>
          <input
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="text-xs text-slate-400">Min 6 characters.</span>
        </label>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        <button
          disabled={status === 'loading'}
          className="w-full bg-emerald-600 text-white rounded-md px-4 py-2 hover:bg-emerald-700 disabled:opacity-60"
        >
          {status === 'loading' ? 'Creating…' : 'Create account'}
        </button>

        <p className="text-sm text-slate-600 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-700 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

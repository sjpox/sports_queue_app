import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { login } from '../features/auth/authSlice';

interface LocationState {
  from?: { pathname: string };
}

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((s) => s.auth);
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/players';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) return <Navigate to={from} replace />;

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
    void dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-emerald-700">Sign in</h2>

        <label className="block text-sm">
          <span className="text-slate-600">Email</span>
          <input
            type="email"
            required
            autoFocus
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
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
          {status === 'loading' ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-sm text-slate-600 text-center">
          No account?{' '}
          <Link to="/register" className="text-emerald-700 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}

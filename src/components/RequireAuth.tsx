import { Navigate, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useAppSelector } from '../store';

export default function RequireAuth({ children }: { children: ReactElement }) {
  const { user, bootstrapped } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!bootstrapped) {
    return <div className="text-slate-500 px-4 py-6">Loading…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

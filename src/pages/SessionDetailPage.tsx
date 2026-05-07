import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchSession,
  fetchForecast,
  clearCurrent,
} from '../features/sessions/sessionsSlice';
import {
  fetchQueue,
  generateQueue,
  updateMatch,
  resetQueue,
} from '../features/queue/queueSlice';
import type { MatchStatus, QueueMatch } from '../types';

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const sessionId = Number(id);
  const dispatch = useAppDispatch();
  const session = useAppSelector((s) => s.sessions.current);
  const forecast = useAppSelector((s) => s.sessions.forecast);
  const matches = useAppSelector((s) => s.queue.matches);

  useEffect(() => {
    dispatch(fetchSession(sessionId));
    dispatch(fetchForecast(sessionId));
    dispatch(fetchQueue(sessionId));
    return () => {
      dispatch(clearCurrent());
    };
  }, [dispatch, sessionId]);

  if (!session) return <div className="text-slate-500">Loading…</div>;

  const playersById = new Map(session.players.map((p) => [p.id, p]));
  const courtsById = new Map(session.courts.map((c) => [c.id, c]));
  const teamLabel = (ids: number[]): string =>
    ids.map((pid) => playersById.get(pid)?.name ?? `#${pid}`).join(' & ');

  const onGenerate = async (): Promise<void> => {
    await dispatch(generateQueue({ sessionId, rounds: 1 }));
    dispatch(fetchQueue(sessionId));
    dispatch(fetchSession(sessionId));
  };
  const onReset = async (): Promise<void> => {
    await dispatch(resetQueue(sessionId));
    dispatch(fetchSession(sessionId));
  };
  const setStatus = (m: QueueMatch, status: MatchStatus): void => {
    dispatch(updateMatch({ id: m.id, status }));
  };

  const rounds = matches.reduce<Record<number, QueueMatch[]>>((acc, m) => {
    (acc[m.roundNo] ||= []).push(m);
    return acc;
  }, {});

  return (
    <div>
      <Link to="/sessions" className="text-emerald-700 text-sm">← All sessions</Link>
      <h2 className="text-2xl font-bold mt-2 mb-1">
        {String(session.sessionDate).slice(0, 10)} ·{' '}
        <span className="capitalize">{session.sport}</span>
      </h2>
      <p className="text-slate-500 text-sm mb-6">
        {Number(session.hours)}h on {session.courts.length} court(s) ·{' '}
        {session.players.length} players
      </p>

      <section className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold mb-2">Expense forecast</h3>
          {forecast ? (
            <ul className="text-sm space-y-1">
              <li className="flex justify-between"><span>Court cost</span><span>{forecast.courtCost.toFixed(2)}</span></li>
              <li className="flex justify-between"><span>Shuttle / balls</span><span>{forecast.shuttleCost.toFixed(2)}</span></li>
              <li className="flex justify-between"><span>Misc</span><span>{forecast.miscCost.toFixed(2)}</span></li>
              <li className="flex justify-between font-bold border-t pt-1 mt-1"><span>Total</span><span>{forecast.total.toFixed(2)}</span></li>
              <li className="flex justify-between text-emerald-700 font-semibold">
                <span>Per player ({forecast.playerCount})</span>
                <span>{forecast.perPlayer.toFixed(2)}</span>
              </li>
            </ul>
          ) : (
            <div className="text-slate-400 text-sm">…</div>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold mb-2">Players ({session.players.length})</h3>
          <ul className="text-sm grid grid-cols-2 gap-y-1">
            {session.players.map((p) => (
              <li key={p.id} className="flex justify-between pr-3">
                <span>{p.name}</span>
                <span className="text-slate-500">{p.gamesPlayed} games</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Match queue</h3>
          <div className="flex gap-2">
            <button
              onClick={onGenerate}
              className="bg-emerald-600 text-white text-sm rounded-md px-3 py-1.5 hover:bg-emerald-700"
            >
              + Generate round
            </button>
            <button onClick={onReset} className="text-sm text-red-600 hover:underline">
              Reset
            </button>
          </div>
        </div>

        {Object.keys(rounds).length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            No matches yet. Click "Generate round" to start the queue.
          </div>
        )}

        {Object.entries(rounds).map(([roundNo, ms]) => (
          <div key={roundNo} className="mb-4">
            <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">
              Round {roundNo}
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {ms.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-lg border p-3 ${
                    m.status === 'done'
                      ? 'bg-slate-50'
                      : m.status === 'playing'
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                    <span>
                      {(m.courtId !== null && courtsById.get(m.courtId)?.name) ||
                        m.courtName ||
                        'No court'}
                    </span>
                    <span className="uppercase">{m.status}</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{teamLabel(m.teamA)}</div>
                    <div className="text-slate-400 text-xs my-0.5">vs</div>
                    <div className="font-medium">{teamLabel(m.teamB)}</div>
                  </div>
                  <div className="flex gap-2 mt-2 text-xs">
                    {m.status !== 'playing' && (
                      <button
                        className="text-emerald-700 hover:underline"
                        onClick={() => setStatus(m, 'playing')}
                      >
                        Start
                      </button>
                    )}
                    {m.status !== 'done' && (
                      <button
                        className="text-slate-700 hover:underline"
                        onClick={() => setStatus(m, 'done')}
                      >
                        Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

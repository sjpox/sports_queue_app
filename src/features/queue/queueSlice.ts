import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { MatchStatus, QueueMatch } from '../../types';

interface State {
  matches: QueueMatch[];
}

const initialState: State = { matches: [] };

export const fetchQueue = createAsyncThunk('queue/fetch', (sessionId: number) =>
  api.get<QueueMatch[]>(`/queue/session/${sessionId}`),
);
export const generateQueue = createAsyncThunk(
  'queue/generate',
  ({ sessionId, rounds = 1 }: { sessionId: number; rounds?: number }) =>
    api.post<{ created: QueueMatch[] }>(`/queue/session/${sessionId}/generate`, {
      rounds,
    }),
);
export const updateMatch = createAsyncThunk(
  'queue/updateMatch',
  ({ id, ...data }: { id: number; status?: MatchStatus; courtId?: number }) =>
    api.put<QueueMatch>(`/queue/match/${id}`, data),
);
export const resetQueue = createAsyncThunk(
  'queue/reset',
  async (sessionId: number) => {
    await api.del(`/queue/session/${sessionId}`);
    return sessionId;
  },
);

const slice = createSlice({
  name: 'queue',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchQueue.fulfilled, (s, a) => {
      s.matches = a.payload;
    });
    b.addCase(updateMatch.fulfilled, (s, a) => {
      const i = s.matches.findIndex((m) => m.id === a.payload.id);
      if (i >= 0) s.matches[i] = { ...s.matches[i], ...a.payload };
    });
    b.addCase(resetQueue.fulfilled, (s) => {
      s.matches = [];
    });
  },
});

export default slice.reducer;

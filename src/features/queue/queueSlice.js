import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchQueue = createAsyncThunk('queue/fetch', (sessionId) =>
  api.get(`/queue/session/${sessionId}`)
);
export const generateQueue = createAsyncThunk('queue/generate', ({ sessionId, rounds = 1 }) =>
  api.post(`/queue/session/${sessionId}/generate`, { rounds })
);
export const updateMatch = createAsyncThunk('queue/updateMatch', ({ id, ...data }) =>
  api.put(`/queue/match/${id}`, data)
);
export const resetQueue = createAsyncThunk('queue/reset', async (sessionId) => {
  await api.del(`/queue/session/${sessionId}`);
  return sessionId;
});

const slice = createSlice({
  name: 'queue',
  initialState: { matches: [] },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchQueue.fulfilled, (s, a) => { s.matches = a.payload; });
    b.addCase(generateQueue.fulfilled, () => { /* refetch in component */ });
    b.addCase(updateMatch.fulfilled, (s, a) => {
      const i = s.matches.findIndex((m) => m.id === a.payload.id);
      if (i >= 0) s.matches[i] = { ...s.matches[i], ...a.payload };
    });
    b.addCase(resetQueue.fulfilled, (s) => { s.matches = []; });
  },
});

export default slice.reducer;

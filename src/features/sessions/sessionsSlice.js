import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchSessions = createAsyncThunk('sessions/fetch', () => api.get('/sessions'));
export const fetchSession = createAsyncThunk('sessions/fetchOne', (id) => api.get(`/sessions/${id}`));
export const createSession = createAsyncThunk('sessions/create', (data) => api.post('/sessions', data));
export const fetchForecast = createAsyncThunk('sessions/forecast', (id) =>
  api.get(`/sessions/${id}/expense-forecast`)
);

const slice = createSlice({
  name: 'sessions',
  initialState: { items: [], current: null, forecast: null },
  reducers: { clearCurrent: (s) => { s.current = null; s.forecast = null; } },
  extraReducers: (b) => {
    b.addCase(fetchSessions.fulfilled, (s, a) => { s.items = a.payload; });
    b.addCase(fetchSession.fulfilled, (s, a) => { s.current = a.payload; });
    b.addCase(createSession.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(fetchForecast.fulfilled, (s, a) => { s.forecast = a.payload; });
  },
});

export const { clearCurrent } = slice.actions;
export default slice.reducer;

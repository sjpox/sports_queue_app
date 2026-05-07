import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { Forecast, Session, SessionDetail, SessionSport } from '../../types';

interface State {
  items: Session[];
  current: SessionDetail | null;
  forecast: Forecast | null;
}

const initialState: State = { items: [], current: null, forecast: null };

export interface SessionInput {
  sessionDate: string;
  sport: SessionSport;
  hours: number;
  shuttleCost: number;
  miscCost: number;
  courtIds: number[];
  playerIds: number[];
}

export const fetchSessions = createAsyncThunk('sessions/fetch', () =>
  api.get<Session[]>('/sessions'),
);
export const fetchSession = createAsyncThunk('sessions/fetchOne', (id: number) =>
  api.get<SessionDetail>(`/sessions/${id}`),
);
export const createSession = createAsyncThunk(
  'sessions/create',
  (data: SessionInput) => api.post<Session>('/sessions', data),
);
export const fetchForecast = createAsyncThunk('sessions/forecast', (id: number) =>
  api.get<Forecast>(`/sessions/${id}/expense-forecast`),
);

const slice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    clearCurrent: (s) => {
      s.current = null;
      s.forecast = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchSessions.fulfilled, (s, a) => {
      s.items = a.payload;
    });
    b.addCase(fetchSession.fulfilled, (s, a) => {
      s.current = a.payload;
    });
    b.addCase(createSession.fulfilled, (s, a) => {
      s.items.unshift(a.payload);
    });
    b.addCase(fetchForecast.fulfilled, (s, a) => {
      s.forecast = a.payload;
    });
  },
});

export const { clearCurrent } = slice.actions;
export default slice.reducer;

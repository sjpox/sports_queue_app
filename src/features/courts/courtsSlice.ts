import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { Court } from '../../types';

interface State {
  items: Court[];
}

const initialState: State = { items: [] };

export type CourtInput = Omit<Court, 'id'>;
export type CourtUpdate = Partial<CourtInput> & { id: number };

export const fetchCourts = createAsyncThunk('courts/fetch', () =>
  api.get<Court[]>('/courts'),
);
export const addCourt = createAsyncThunk('courts/add', (data: CourtInput) =>
  api.post<Court>('/courts', data),
);
export const updateCourt = createAsyncThunk(
  'courts/update',
  ({ id, ...data }: CourtUpdate) => api.put<Court>(`/courts/${id}`, data),
);
export const deleteCourt = createAsyncThunk('courts/delete', async (id: number) => {
  await api.del(`/courts/${id}`);
  return id;
});

const slice = createSlice({
  name: 'courts',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCourts.fulfilled, (s, a) => {
      s.items = a.payload;
    });
    b.addCase(addCourt.fulfilled, (s, a) => {
      s.items.push(a.payload);
    });
    b.addCase(updateCourt.fulfilled, (s, a) => {
      const i = s.items.findIndex((c) => c.id === a.payload.id);
      if (i >= 0) s.items[i] = a.payload;
    });
    b.addCase(deleteCourt.fulfilled, (s, a) => {
      s.items = s.items.filter((c) => c.id !== a.payload);
    });
  },
});

export default slice.reducer;

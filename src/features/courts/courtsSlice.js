import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchCourts = createAsyncThunk('courts/fetch', () => api.get('/courts'));
export const addCourt = createAsyncThunk('courts/add', (data) => api.post('/courts', data));
export const updateCourt = createAsyncThunk('courts/update', ({ id, ...data }) =>
  api.put(`/courts/${id}`, data)
);
export const deleteCourt = createAsyncThunk('courts/delete', async (id) => {
  await api.del(`/courts/${id}`);
  return id;
});

const slice = createSlice({
  name: 'courts',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCourts.fulfilled, (s, a) => { s.items = a.payload; });
    b.addCase(addCourt.fulfilled, (s, a) => { s.items.push(a.payload); });
    b.addCase(updateCourt.fulfilled, (s, a) => {
      const i = s.items.findIndex((p) => p.id === a.payload.id);
      if (i >= 0) s.items[i] = a.payload;
    });
    b.addCase(deleteCourt.fulfilled, (s, a) => {
      s.items = s.items.filter((p) => p.id !== a.payload);
    });
  },
});

export default slice.reducer;

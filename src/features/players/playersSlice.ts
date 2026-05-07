import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { Player } from '../../types';

interface State {
  items: Player[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
}

const initialState: State = { items: [], status: 'idle', error: null };

export type PlayerInput = Omit<Player, 'id' | 'createdAt'>;
export type PlayerUpdate = Partial<PlayerInput> & { id: number };

export const fetchPlayers = createAsyncThunk('players/fetch', () =>
  api.get<Player[]>('/players'),
);
export const addPlayer = createAsyncThunk('players/add', (data: PlayerInput) =>
  api.post<Player>('/players', data),
);
export const updatePlayer = createAsyncThunk(
  'players/update',
  ({ id, ...data }: PlayerUpdate) => api.put<Player>(`/players/${id}`, data),
);
export const deletePlayer = createAsyncThunk('players/delete', async (id: number) => {
  await api.del(`/players/${id}`);
  return id;
});

const slice = createSlice({
  name: 'players',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchPlayers.pending, (s) => {
      s.status = 'loading';
    });
    b.addCase(fetchPlayers.fulfilled, (s, a) => {
      s.status = 'ready';
      s.items = a.payload;
    });
    b.addCase(fetchPlayers.rejected, (s, a) => {
      s.status = 'error';
      s.error = a.error.message ?? null;
    });
    b.addCase(addPlayer.fulfilled, (s, a) => {
      s.items.push(a.payload);
    });
    b.addCase(updatePlayer.fulfilled, (s, a) => {
      const i = s.items.findIndex((p) => p.id === a.payload.id);
      if (i >= 0) s.items[i] = a.payload;
    });
    b.addCase(deletePlayer.fulfilled, (s, a) => {
      s.items = s.items.filter((p) => p.id !== a.payload);
    });
  },
});

export default slice.reducer;

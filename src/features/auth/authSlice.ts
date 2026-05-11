import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api, tokenStore } from '../../api/client';
import type { AuthResponse, AuthUser } from '../../types';

interface State {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  bootstrapped: boolean;
}

const initialState: State = {
  user: null,
  status: 'idle',
  error: null,
  bootstrapped: false,
};

export interface LoginPayload {
  email: string;
  password: string;
}
export interface RegisterPayload extends LoginPayload {
  name: string;
}

export const login = createAsyncThunk<AuthResponse, LoginPayload>(
  'auth/login',
  (data) => api.post<AuthResponse>('/auth/login', data),
);

export const register = createAsyncThunk<AuthResponse, RegisterPayload>(
  'auth/register',
  (data) => api.post<AuthResponse>('/auth/register', data),
);

export const fetchMe = createAsyncThunk<AuthUser>('auth/me', () =>
  api.get<AuthUser>('/auth/me'),
);

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (s) => {
      tokenStore.clear();
      s.user = null;
      s.error = null;
      s.status = 'idle';
    },
    setBootstrapped: (s, a: PayloadAction<boolean>) => {
      s.bootstrapped = a.payload;
    },
  },
  extraReducers: (b) => {
    const handleAuth = (s: State, a: PayloadAction<AuthResponse>) => {
      tokenStore.set(a.payload.token);
      s.user = a.payload.user;
      s.status = 'ready';
      s.error = null;
    };
    b.addCase(login.pending, (s) => {
      s.status = 'loading';
      s.error = null;
    });
    b.addCase(login.fulfilled, handleAuth);
    b.addCase(login.rejected, (s, a) => {
      s.status = 'error';
      s.error = a.error.message ?? 'Login failed';
    });
    b.addCase(register.pending, (s) => {
      s.status = 'loading';
      s.error = null;
    });
    b.addCase(register.fulfilled, handleAuth);
    b.addCase(register.rejected, (s, a) => {
      s.status = 'error';
      s.error = a.error.message ?? 'Register failed';
    });
    b.addCase(fetchMe.fulfilled, (s, a) => {
      s.user = a.payload;
      s.status = 'ready';
      s.bootstrapped = true;
    });
    b.addCase(fetchMe.rejected, (s) => {
      tokenStore.clear();
      s.user = null;
      s.bootstrapped = true;
    });
  },
});

export const { logout, setBootstrapped } = slice.actions;
export default slice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import authReducer from '../features/auth/authSlice';
import playersReducer from '../features/players/playersSlice';
import courtsReducer from '../features/courts/courtsSlice';
import sessionsReducer from '../features/sessions/sessionsSlice';
import queueReducer from '../features/queue/queueSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    players: playersReducer,
    courts: courtsReducer,
    sessions: sessionsReducer,
    queue: queueReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

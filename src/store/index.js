import { configureStore } from '@reduxjs/toolkit';
import playersReducer from '../features/players/playersSlice';
import courtsReducer from '../features/courts/courtsSlice';
import sessionsReducer from '../features/sessions/sessionsSlice';
import queueReducer from '../features/queue/queueSlice';

export const store = configureStore({
  reducer: {
    players: playersReducer,
    courts: courtsReducer,
    sessions: sessionsReducer,
    queue: queueReducer,
  },
});

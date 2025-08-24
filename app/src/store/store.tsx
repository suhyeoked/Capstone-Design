import { configureStore } from '@reduxjs/toolkit';
import goalReducer from './goalSlice';
import userReducer from './userSlice'; // 기존 유저 slice

const store = configureStore({
  reducer: {
    goal: goalReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

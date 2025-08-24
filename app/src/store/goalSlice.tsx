// src/store/goalSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Goal = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
};

type GoalState = {
  list: Goal[];
};

const initialState: GoalState = { list: [] };

const goalSlice = createSlice({
  name: 'goal',
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<Goal>) => {
      state.list.push(action.payload);
    },
  },
});

export const { addGoal } = goalSlice.actions;
export default goalSlice.reducer;

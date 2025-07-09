import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ArgsProps } from 'antd/lib/message';
import type { RootState } from '../store.ts';

const initialState: ArgsProps = {
  content: '',
  duration: 1.5,
  key: '',
  type: 'success',
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    showMessage(state, action: PayloadAction<ArgsProps>) {
      return { ...state, ...action.payload };
    },
    clearMessage() {
      return initialState;
    },
  },
});

export const { showMessage, clearMessage } = messageSlice.actions;

export const messageSelector = (state: RootState) => state.message;
export const messageReducer = messageSlice.reducer;

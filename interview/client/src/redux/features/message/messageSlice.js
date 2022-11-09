import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messageTest: 0,
  toggleMessage: false,
  toggleUserList: false,
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    sendMessageRedux: (state) => {
      state.messageTest += 1;
    },
    toggleActionMessage: (state) => {
      state.toggleMessage = !state.toggleMessage;
    },
    toggleActionUserList: (state) => {
      state.toggleUserList = !state.toggleUserList;
    },
  },
});

// Action creators are generated for each case reducer function
export const { sendMessageRedux, toggleActionMessage, toggleActionUserList } =
  messageSlice.actions;

export default messageSlice.reducer;

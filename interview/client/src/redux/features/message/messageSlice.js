import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toggleMessage: false,
  toggleUserList: false,
  messageChat: [],
  currentMsg: ""
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    toggleActionMessage: (state) => {
      state.toggleMessage = !state.toggleMessage;
    },
    toggleActionUserList: (state) => {
      state.toggleUserList = !state.toggleUserList;
    },
    dataMessage: (state, action) => {
      state.messageChat = action.payload
    },
    currentMessage: (state, action) => {
      state.currentMsg = action.payload
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleActionMessage, toggleActionUserList, dataMessage, currentMessage } =
  messageSlice.actions;

export default messageSlice.reducer;

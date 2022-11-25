import { createSlice } from '@reduxjs/toolkit';
import { socket } from '../../saga';
import dico from '../../../common/dico';

const { SOCKET_NEW_MESSAGE } = dico;

const initialState = {
  socket: "",
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    addedSocket: (state, action) => {
      state.socket = action.payload
    },
    request: (state, action) => {
      socket.emit(SOCKET_NEW_MESSAGE, action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addedSocket, request } = socketSlice.actions;

export default socketSlice.reducer;

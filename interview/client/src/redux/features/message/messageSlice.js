import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    messageTest: 0,
}

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        sendMessageRedux: (state, {payload}) => {
        state.messageTest += 1 
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { sendMessageRedux } = messageSlice.actions
  
  export default messageSlice.reducer
import { configureStore } from '@reduxjs/toolkit'
import messageSlice from './features/message/messageSlice'


export const store = configureStore({
  reducer: {
    counter: messageSlice
  },
})
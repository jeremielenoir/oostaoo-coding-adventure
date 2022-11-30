import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import messageSlice from './features/message/messageSlice'
import socketSlice from './features/socket/socketSlice'
import { watchIncrementMessage } from "./saga"

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    message: messageSlice,
    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return [...getDefaultMiddleware({ thunk: false, serializableCheck: false }), sagaMiddleware];
  },
})

sagaMiddleware.run(watchIncrementMessage);
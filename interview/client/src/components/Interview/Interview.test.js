import React from 'react';
import { render } from '@testing-library/react';
import Interview from './Interview';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { StreamContext } from '../../common/StreamContext';
import {
  myVideo,
  partnerSocketID,
  partnerVideo,
} from '../../common/StreamContext';
import { socketSlice } from '../../redux/features/socket/socketSlice';
import { messageSlice } from '../../redux/features/message/messageSlice';

const rootReducer = combineReducers({
  socket: socketSlice.reducer,
  message: messageSlice.reducer
});

const store = configureStore({ reducer: rootReducer })

describe('Interview component tests', () => {
  test('renders correctly', () => {
    render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{ myVideo, partnerSocketID, partnerVideo }}
        >
          <Interview />
        </StreamContext.Provider>
      </Provider>
    );
  });
});

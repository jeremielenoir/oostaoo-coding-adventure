import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';

import UsersSection from './UsersSection';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { socketSlice } from '../../redux/features/socket/socketSlice';
import { messageSlice } from '../../redux/features/message/messageSlice';

const rootReducer = combineReducers({
  socket: socketSlice.reducer,
  message: messageSlice.reducer
});

const store = configureStore({ reducer: rootReducer })

describe('UsersSection component tests', () => {
  test('should render correctly', () => {
    render(
      <Provider store={store}>
        <UsersSection />
      </Provider>
    );
  });

  test('should have a title', () => {
    render(
      <Provider store={store}>
        <UsersSection />
      </Provider>
    );

    const title = screen.getByText(/Participants/i);

    expect(title).toBeInTheDocument();
  });

  test('should have a button to close', () => {
    render(
      <Provider store={store}>
        <UsersSection />
      </Provider>
    );

    const closeButton = screen.getByTestId('toggleParticipantBtn');

    expect(closeButton).toBeInTheDocument();
  });

  test('click on the button should trigger the toggleParticipant fonction passed in props', () => {
    const mockToggleParticipant = jest.fn();
    render(
      <Provider store={store}>
        <UsersSection toggleParticipant={mockToggleParticipant} />
      </Provider>
    );

    const closeButton = screen.getByTestId('toggleParticipantBtn');
    fireEvent.click(closeButton);

    expect(mockToggleParticipant).toHaveBeenCalledTimes(1);
  });
});

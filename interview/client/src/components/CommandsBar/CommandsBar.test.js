import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import CommandsBar from './CommandsBar';

import { messageSlice } from '../../redux/features/message/messageSlice';
import { socketSlice } from '../../redux/features/socket/socketSlice';

// Important to test everything coming from StreamContext
import { StreamContext } from '../../common/StreamContext';
import {
  micOn,
  micToggle,
  videoCamOn,
  videoCamToggle,
} from '../../common/StreamContext';

const rootReducer = combineReducers({
  socket: socketSlice.reducer,
  message: messageSlice.reducer
});

const store = configureStore({ reducer: rootReducer })

describe('CommandsBar component tests', () => {
  test('should render correctly', () => {
    render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{ micOn, micToggle, videoCamOn, videoCamToggle }}
        >
          <CommandsBar />
        </StreamContext.Provider>
      </Provider>
    );
  });

  test('should have a button to activate mic', () => {
    render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{ micOn, micToggle, videoCamOn, videoCamToggle }}
        >
          <CommandsBar />
        </StreamContext.Provider>
      </Provider>
    );

    const micOnButton = screen.getByTestId('micOnBtn');
    const micOffButton = screen.queryByTestId('micOffBtn');

    expect(micOnButton).toBeInTheDocument();
    expect(micOffButton).not.toBeInTheDocument();
  });

  test('should have a button to deactivate mic instead of the mic on one if the micOn prop is true', () => {
    render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{ micOn: true, micToggle, videoCamOn, videoCamToggle }}
        >
          <CommandsBar />
        </StreamContext.Provider>
      </Provider>
    );
    const micOffButton = screen.getByTestId('micOffBtn');
    const micOnButton = screen.queryByTestId('micOnBtn');

    expect(micOffButton).toBeInTheDocument();
    expect(micOnButton).not.toBeInTheDocument();
  });

  test('The mic on button should trigger the micToggle function passed via context', () => {
    const mockFunction = jest.fn();
    render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{ micOn, micToggle: mockFunction, videoCamOn, videoCamToggle }}
        >
          <CommandsBar />
        </StreamContext.Provider>
      </Provider>
    );

    const micOnButton = screen.getByTestId('micOnBtn');
    fireEvent.click(micOnButton);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('The mic off button should also trigger the micToggle function passed via context', () => {
    const mockFunction = jest.fn();
    render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{
            micOn: true,
            micToggle: mockFunction,
            videoCamOn,
            videoCamToggle,
          }}
        >
          <CommandsBar />
        </StreamContext.Provider>
      </Provider>
    );

    const micOffButton = screen.getByTestId('micOffBtn');
    fireEvent.click(micOffButton);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('should have a videoCamOn button', () => {
    render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{ micOn, micToggle, videoCamOn, videoCamToggle }}
        >
          <CommandsBar />
        </StreamContext.Provider>
      </Provider>
    );

    const videoCamOnButton = screen.getByTestId('videoCamOnBtn');
    const videoCamOffButton = screen.queryByTestId('videoCamOffBtn');

    expect(videoCamOnButton).toBeInTheDocument();
    expect(videoCamOffButton).not.toBeInTheDocument();
  });

  test('should have a videoCamOff button instead of the videoCamOn one if the videoCamOn prop is true', () => {
    render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{ micOn, micToggle, videoCamOn: true, videoCamToggle }}
        >
          <CommandsBar />
        </StreamContext.Provider>
      </Provider>
    );

    const videoCamOffButton = screen.getByTestId('videoCamOffBtn');
    const videoCamOnButton = screen.queryByTestId('videoCamOnBtn');

    expect(videoCamOffButton).toBeInTheDocument();
    expect(videoCamOnButton).not.toBeInTheDocument();
  });

  test('The videoCam on button should trigger the videoCamToggle function passed via context', () => {
    const mockFunction = jest.fn();
    render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{ micOn, micToggle, videoCamOn, videoCamToggle: mockFunction }}
        >
          <CommandsBar />
        </StreamContext.Provider>
      </Provider>
    );

    const videoCamOnButton = screen.getByTestId('videoCamOnBtn');
    fireEvent.click(videoCamOnButton);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('The videoCam on button should also trigger the videoCamToggle function passed via context', () => {
    const mockFunction = jest.fn();
    render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{
            micOn,
            micToggle,
            videoCamOn: true,
            videoCamToggle: mockFunction,
          }}
        >
          <CommandsBar />
        </StreamContext.Provider>
      </Provider>
    );

    const videoCamOffButton = screen.getByTestId('videoCamOffBtn');
    fireEvent.click(videoCamOffButton);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('should have a button to end call', () => {
    render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{ micOn, micToggle, videoCamOn, videoCamToggle }}
        >
          <CommandsBar />
        </StreamContext.Provider>
      </Provider>
    );

    const button = screen.getByTestId('callEndButton');

    expect(button).toBeInTheDocument();
  });

  test('should have a toggle users button in the footer', () => {
    const { container } = render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{ micOn, micToggle, videoCamOn, videoCamToggle }}
        >
          <CommandsBar />
        </StreamContext.Provider>
      </Provider>
    );

    const toggleUsersBtn = container.getElementsByClassName('footer-icons');

    expect(toggleUsersBtn).toBeTruthy();
  });

  test('should have a toggle chat button in the footer', () => {
    render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{ micOn, micToggle, videoCamOn, videoCamToggle }}
        >
          <CommandsBar />
        </StreamContext.Provider>
      </Provider>
    );

    const toggleChatBtn = screen.getByTestId('chat-icon');

    expect(toggleChatBtn).toBeInTheDocument();
  });

  test('click on toggle users button should trigger the toggleParticipant function passed in props', () => {
    const mockFunction = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{ micOn, micToggle, videoCamOn, videoCamToggle }}
        >
          <CommandsBar toggleParticipant={mockFunction} />
        </StreamContext.Provider>
      </Provider>
    );

    const toggleUsersBtn = container.getElementsByClassName('footer-icons')[0];
    fireEvent.click(toggleUsersBtn);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('click on toggle chat button should trigger the toggleMessage function passed in props', () => {
    const mockFunction = jest.fn();
    render(
      <Provider store={store}>
        <StreamContext.Provider
          value={{ micOn, micToggle, videoCamOn, videoCamToggle }}
        >
          <CommandsBar toggleMessage={mockFunction} />
        </StreamContext.Provider>
      </Provider>
    );

    const toggleChatBtn = screen.getByTestId('chat-icon');
    fireEvent.click(toggleChatBtn);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});

import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import ChatSection, { sendMessage } from './ChatSection';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import socketSlice from '../../redux/features/socket/socketSlice';
import messageSlice from '../../redux/features/message/messageSlice';
import CloseIcon from '@material-ui/icons/Close';

// import { SocketContext } from '../../common/SocketContext';
// import { socket, chatMessages } from '../../common/SocketContext';

const store = configureStore({ reducer: { socket: socketSlice, message: messageSlice } })

// some mock data for the component so it prevents the "Cannot read properties of undefined (reading 'response')" error
const mockMessage = [
  { text: 'Hello there !', date: '19 BBY', id: '4684216846' },
  {
    text: 'General Kenobi, you are a bold one !',
    date: '19 BBY',
    id: '4684216846',
  },
];

describe('ChatSection component tests', () => {
  test('should render correctly', () => {
    render(
      <Provider store={store}>
        <ChatSection />
      </Provider>
    )
  });

  test('chat should have a title', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ChatSection />
      </Provider>
    );

    const text = getByText(/Messages dans l'appel/i);

    expect(text).toBeInTheDocument();
  });

  test('Textfield should be empty', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <ChatSection />
      </Provider>
    );

    const textfield = getByTestId('textfield');

    expect(textfield.value).toBe('');
  });

  // test('any change in Textfield should trigger the onChangeMessage action passed in props', () => {
  //   const mockFunction = jest.fn();
  //   const { getByTestId } = render(
  //     <SocketContext.Provider value={{ socket, chatMessages: mockMessage }}>
  //       <ChatSection />
  //     </SocketContext.Provider>
  //   );

  //   const textfield = getByTestId('textfield');
  //   fireEvent.change(textfield, { target: { value: 'Hello' } });
  //   fireEvent.change(textfield, { target: { value: 'there !' } });

  //   expect(mockFunction).toHaveBeenCalledTimes(2);
  // });

  // test('the text passed in message prop should appear in Textfield', () => {
  //   render(
  //     <SocketContext.Provider value={{ socket, chatMessages: mockMessage }}>
  //       <ChatSection />
  //     </SocketContext.Provider>
  //   );

  //   // const textfield = screen.getByTestId('textfield');

  //   expect(chatMessages).toBe('I am the senate !');
  // });

  test('should have send message button', () => {
    const { getByRole } = render(
      <Provider store={store}>
        <ChatSection />
      </Provider>
    );

    const button = getByRole('button');

    expect(button).toBeInTheDocument();
  });

  // test('clicking on the button should trigger the sendMessage action passed in props', () => {
  //   const mockFunction = jest.fn();
  //   const { getByRole } = render(
  //     <SocketContext.Provider value={{ socket, chatMessages: mockMessage }}>
  //       <ChatSection />
  //     </SocketContext.Provider>
  //   );

  //   const button = getByRole('button');
  //   fireEvent.click(button);

  //   expect(mockFunction).toHaveBeenCalledTimes(1);
  // });

  test('should have a button to close messages', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <ChatSection />
      </Provider>
    );

    const closeBtn = getByTestId('closeButton');

    expect(closeBtn).toBeInTheDocument();
  });

  test('the closeButton should trigger the onClick function action', () => {
    const mockFunction = jest.fn();
    jest.spyOn(store, 'dispatch').mockImplementation(mockFunction);

    const { getByTestId } = render(
      <Provider store={store}>
        <ChatSection />
      </Provider>
    );

    const closeBtn = getByTestId('closeButton');
    fireEvent.click(closeBtn);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});

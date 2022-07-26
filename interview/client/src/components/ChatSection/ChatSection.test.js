import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';

import ChatSection from './ChatSection';

// some mock data for the component so it prevents the "Cannot read properties of undefined (reading 'response')" error
const mockMessage = {
  response: [
    { text: 'Hello there !', date: '19 BBY' },
    {
      text: 'General Kenobi, you are a bold one !',
      date: '19 BBY',
    },
  ],
};

describe('ChatSection component tests', () => {
  test('should render correctly', () => {
    render(<ChatSection messages={mockMessage} />);
  });

  test('chat should have a title', () => {
    const { getByText } = render(<ChatSection messages={mockMessage} />);

    const text = getByText(/Messages dans l'appel/i);

    expect(text).toBeInTheDocument();
  });

  test('Textfield should be empty', () => {
    const { getByTestId } = render(<ChatSection messages={mockMessage} />);

    const textfield = getByTestId('textfield');

    expect(textfield.value).toBe('');
  });

  test('any change in Textfield should trigger the onChangeMessage action passed in props', () => {
    const mockFunction = jest.fn();
    const { getByTestId } = render(
      <ChatSection messages={mockMessage} onChangeMessage={mockFunction} />
    );

    const textfield = getByTestId('textfield');
    fireEvent.change(textfield, { target: { value: 'Hello' } });
    fireEvent.change(textfield, { target: { value: 'there !' } });

    expect(mockFunction).toHaveBeenCalledTimes(2);
  });

  test('should have send message button', () => {
    const { getByRole } = render(<ChatSection messages={mockMessage} />);

    const button = getByRole('button');

    expect(button).toBeInTheDocument();
  });

  test('clicking on the button should trigger the sendMessage action passed in props', () => {
    const mockFunction = jest.fn();
    const { getByRole } = render(
      <ChatSection messages={mockMessage} sendMessage={mockFunction} />
    );

    const button = getByRole('button');
    fireEvent.click(button);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('should have a button to close messages', () => {
    const { getByTestId } = render(<ChatSection messages={mockMessage} />);

    const closeBtn = getByTestId('closeButton');

    expect(closeBtn).toBeInTheDocument();
  });

  test('the closeButton should trigger the toggleMessage action passed in props', () => {
    const mockFunction = jest.fn();
    const { getByTestId } = render(
      <ChatSection messages={mockMessage} toggleMessage={mockFunction} />
    );

    const closeBtn = getByTestId('closeButton');
    fireEvent.click(closeBtn);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});

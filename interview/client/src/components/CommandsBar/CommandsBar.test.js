import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommandsBar from './CommandsBar';

describe('CommandsBar component tests', () => {
  test('should render correctly', () => {
    render(<CommandsBar />);
  });

  test('should have a button to activate mic', () => {
    render(<CommandsBar />);

    const micOnButton = screen.getByTestId('micOnBtn');
    const micOffButton = screen.queryByTestId('micOffBtn');

    expect(micOnButton).toBeInTheDocument();
    expect(micOffButton).not.toBeInTheDocument();
  });

  test('should have a button to deactivate mic instead of the mic on one if the micOn prop is true', () => {
    render(<CommandsBar micOn />);

    const micOffButton = screen.getByTestId('micOffBtn');
    const micOnButton = screen.queryByTestId('micOnBtn');

    expect(micOffButton).toBeInTheDocument();
    expect(micOnButton).not.toBeInTheDocument();
  });

  test('The mic on button should trigger the micToggle function passed in props', () => {
    const mockFunction = jest.fn();
    render(<CommandsBar micToggle={mockFunction} />);

    const micOnButton = screen.getByTestId('micOnBtn');
    fireEvent.click(micOnButton);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('The mic off button should trigger the micToggle function passed in props', () => {
    const mockFunction = jest.fn();
    render(<CommandsBar micOn micToggle={mockFunction} />);

    const micOffButton = screen.getByTestId('micOffBtn');
    fireEvent.click(micOffButton);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('should have a button to end call', () => {
    render(
      <BrowserRouter>
        <CommandsBar />
      </BrowserRouter>
    );

    const button = screen.getByTestId('callEndButton');

    expect(button).toBeInTheDocument();
  });

  test('should have a toggle users button in the footer', () => {
    const { container } = render(<CommandsBar />);

    const toggleUsersBtn = container.getElementsByClassName('footer-icons');

    expect(toggleUsersBtn).toBeTruthy();
  });

  test('should have a toggle users and a toggle chat button in the footer', () => {
    render(<CommandsBar />);

    const toggleUsersBtn = screen.getByTestId('group-icon');
    const toggleChatBtn = screen.getByTestId('chat-icon');

    expect(toggleUsersBtn).toBeInTheDocument();
    expect(toggleChatBtn).toBeInTheDocument();
  });

  test('click on toggle users button should trigger the toggleParticipant function passed in props', () => {
    const mockFunction = jest.fn();
    render(<CommandsBar toggleParticipant={mockFunction} />);

    const toggleUsersBtn = screen.getByTestId('group-icon');
    fireEvent.click(toggleUsersBtn);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('click on toggle chat button should trigger the toggleMessage function passed in props', () => {
    const mockFunction = jest.fn();
    render(<CommandsBar toggleMessage={mockFunction} />);

    const toggleChatBtn = screen.getByTestId('chat-icon');
    fireEvent.click(toggleChatBtn);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});

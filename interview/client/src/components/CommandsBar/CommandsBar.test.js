import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommandsBar from './CommandsBar';
import { StreamContextProvider } from '../../common/StreamContext';

describe('CommandsBar component tests', () => {
  test('should render correctly', () => {
    render(<CommandsBar />);
  });

  test('should have a button to activate mic', () => {
    render(
      <StreamContextProvider>
        <CommandsBar />
      </StreamContextProvider>
    );

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

  test('should have a button to desactive videoCam', () => {
    render(<CommandsBar />);

    const videoCamOnButton = screen.getByTestId('videoCamOnBtn');
    const videoCamOffButton = screen.queryByTestId('videoCamOffBtn');

    expect(videoCamOnButton).toBeInTheDocument();
    expect(videoCamOffButton).not.toBeInTheDocument();
  });

  test('should have a button to deactivate videoCam instead of the videoCam on one if the videoCamOn prop is true', () => {
    render(<CommandsBar videoCamOn />);

    const videoCamOffButton = screen.getByTestId('videoCamOffBtn');
    const videoCamOnButton = screen.queryByTestId('videoCamOnBtn');

    expect(videoCamOffButton).toBeInTheDocument();
    expect(videoCamOnButton).not.toBeInTheDocument();
  });

  test('The videoCam on button should trigger the videoCamToggle function passed in props', () => {
    const mockFunction = jest.fn();
    render(<CommandsBar videoCamToggle={mockFunction} />);

    const videoCamOnButton = screen.getByTestId('videoCamOnBtn');
    fireEvent.click(videoCamOnButton);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('The videoCam on button should trigger the videoCamToggle function passed in props', () => {
    const mockFunction = jest.fn();
    render(<CommandsBar videoCamOn videoCamToggle={mockFunction} />);

    const videoCamOffButton = screen.getByTestId('videoCamOffBtn');
    fireEvent.click(videoCamOffButton);

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

import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommandsBar from '../components/CommandsBar';

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
    render(<CommandsBar />);

    const button = screen.getByTestId('callEndButton');

    expect(button).toBeInTheDocument();
  });

  test('clicking on the end call button should trigger the handleOpen function passed in props', () => {
    const mockFunction = jest.fn();
    render(<CommandsBar handleOpen={mockFunction} />);

    const button = screen.getByTestId('callEndButton');
    fireEvent.click(button);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('the modal should not be open', () => {
    render(<CommandsBar />);

    const modalText = screen.queryByText(/Mettre fin à l'appel vidéo ?/i);

    expect(modalText).not.toBeInTheDocument();
  });

  test('modal should be open if the open prop is true', () => {
    // had to use BrowserRouter because the modal contains a <Link>
    render(
      <BrowserRouter>
        <CommandsBar open />
      </BrowserRouter>
    );

    const modalText = screen.getByText(/Mettre fin à l'appel vidéo ?/i);

    expect(modalText).toBeInTheDocument();
  });

  test('modal should have a button to close itself', () => {
    render(
      <BrowserRouter>
        <CommandsBar open />
      </BrowserRouter>
    );

    const closeModalButton = screen.getByTestId('closeModalBtn');

    expect(closeModalButton).toBeInTheDocument();
  });

  test('click on the close modal button should trigger the handleClose function passed in props', () => {
    const mockFunction = jest.fn();
    render(
      <BrowserRouter>
        <CommandsBar open handleClose={mockFunction} />
      </BrowserRouter>
    );

    const closeModalButton = screen.getByTestId('closeModalBtn');
    fireEvent.click(closeModalButton);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('the modal should have a "annuler" button', () => {
    render(
      <BrowserRouter>
        <CommandsBar open />
      </BrowserRouter>
    );

    const cancelButton = screen.getByText(/annuler/i);

    expect(cancelButton).toBeInTheDocument();
  });

  test('click on the "annuler" button should trigger the handleClose function passed in props', () => {
    const mockFunction = jest.fn();
    render(
      <BrowserRouter>
        <CommandsBar open handleClose={mockFunction} />
      </BrowserRouter>
    );

    const cancelButton = screen.getByText(/annuler/i);
    fireEvent.click(cancelButton);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('should have a "quitter" button', () => {
    render(
      <BrowserRouter>
        <CommandsBar open />
      </BrowserRouter>
    );

    const quitButton = screen.getByText('Quitter');

    expect(quitButton).toBeInTheDocument();
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

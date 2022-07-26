import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ModalLeaveInterview from './ModalLeaveInterview';

describe('ModalLeaveInterview component tests', () => {
  test('modal should have a button to close itself', () => {
    render(
      <BrowserRouter>
        <ModalLeaveInterview open />
      </BrowserRouter>
    );

    const closeModalButton = screen.getByTestId('closeModalBtn');

    expect(closeModalButton).toBeInTheDocument();
  });

  test('click on the close modal button should trigger the handleClose function passed in props', () => {
    const mockFunction = jest.fn();
    render(
      <BrowserRouter>
        <ModalLeaveInterview open handleClose={mockFunction} />
      </BrowserRouter>
    );

    const closeModalButton = screen.getByTestId('closeModalBtn');
    fireEvent.click(closeModalButton);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('the modal should not be open', () => {
    render(<ModalLeaveInterview />);

    const modalText = screen.queryByText(/Mettre fin à l'appel vidéo ?/i);

    expect(modalText).not.toBeInTheDocument();
  });

  test('modal should be open if the open prop is true', () => {
    // had to use BrowserRouter because the modal contains a <Link>
    render(
      <BrowserRouter>
        <ModalLeaveInterview open />
      </BrowserRouter>
    );

    const modalText = screen.getByText(/Mettre fin à l'appel vidéo ?/i);

    expect(modalText).toBeInTheDocument();
  });

  test('the modal should have a "annuler" button', () => {
    render(
      <BrowserRouter>
        <ModalLeaveInterview open />
      </BrowserRouter>
    );

    const cancelButton = screen.getByText(/annuler/i);

    expect(cancelButton).toBeInTheDocument();
  });

  test('click on the "annuler" button should trigger the handleClose function passed in props', () => {
    const mockFunction = jest.fn();
    render(
      <BrowserRouter>
        <ModalLeaveInterview open handleClose={mockFunction} />
      </BrowserRouter>
    );

    const cancelButton = screen.getByText(/annuler/i);
    fireEvent.click(cancelButton);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('should have a "quitter" button', () => {
    render(
      <BrowserRouter>
        <ModalLeaveInterview open />
      </BrowserRouter>
    );

    const quitButton = screen.getByText('Quitter');

    expect(quitButton).toBeInTheDocument();
  });
});

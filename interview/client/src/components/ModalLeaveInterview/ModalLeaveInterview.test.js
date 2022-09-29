import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ModalLeaveInterview from './ModalLeaveInterview';

import { StreamContext } from '../../common/StreamContext';
import { leaveCall } from '../../common/StreamContext';

describe('ModalLeaveInterview component tests', () => {
  test('modal should have a button to close itself', () => {
    render(
      <StreamContext.Provider value={{ leaveCall }}>
        <BrowserRouter>
          <ModalLeaveInterview open />
        </BrowserRouter>
      </StreamContext.Provider>
    );

    const closeModalButton = screen.getByTestId('closeModalBtn');

    expect(closeModalButton).toBeInTheDocument();
  });

  test('click on the close modal button should trigger the handleClose function passed in props', () => {
    const mockFunction = jest.fn();
    render(
      <StreamContext.Provider value={{ leaveCall }}>
        <BrowserRouter>
          <ModalLeaveInterview open handleClose={mockFunction} />
        </BrowserRouter>
      </StreamContext.Provider>
    );

    const closeModalButton = screen.getByTestId('closeModalBtn');
    fireEvent.click(closeModalButton);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('the modal should not be open', () => {
    render(
      <StreamContext.Provider value={{ leaveCall }}>
        <BrowserRouter>
          <ModalLeaveInterview />
        </BrowserRouter>
      </StreamContext.Provider>
    );

    const modalText = screen.queryByText(/Mettre fin à l'appel vidéo ?/i);

    expect(modalText).not.toBeInTheDocument();
  });

  test('modal should be open if the open prop is true', () => {
    // had to use BrowserRouter because the modal contains a <Link>
    render(
      <StreamContext.Provider value={{ leaveCall }}>
        <BrowserRouter>
          <ModalLeaveInterview open />
        </BrowserRouter>
      </StreamContext.Provider>
    );

    const modalText = screen.getByText(/Mettre fin à l'appel vidéo ?/i);

    expect(modalText).toBeInTheDocument();
  });

  test('the modal should have a "annuler" button', () => {
    render(
      <StreamContext.Provider value={{ leaveCall }}>
        <BrowserRouter>
          <ModalLeaveInterview open />
        </BrowserRouter>
      </StreamContext.Provider>
    );

    const cancelButton = screen.getByText(/annuler/i);

    expect(cancelButton).toBeInTheDocument();
  });

  test('click on the "annuler" button should trigger the handleClose function passed in props', () => {
    const mockFunction = jest.fn();
    render(
      <StreamContext.Provider value={{ leaveCall }}>
        <BrowserRouter>
          <ModalLeaveInterview open handleClose={mockFunction} />
        </BrowserRouter>
      </StreamContext.Provider>
    );

    const cancelButton = screen.getByText(/annuler/i);
    fireEvent.click(cancelButton);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('should have a "quitter" button', () => {
    render(
      <StreamContext.Provider value={{ leaveCall }}>
        <BrowserRouter>
          <ModalLeaveInterview open />
        </BrowserRouter>
      </StreamContext.Provider>
    );

    const quitButton = screen.getByText('Quitter');

    expect(quitButton).toBeInTheDocument();
  });
});

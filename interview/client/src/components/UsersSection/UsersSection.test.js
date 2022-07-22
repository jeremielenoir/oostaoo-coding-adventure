import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import UsersSection from './UsersSection';

describe('UsersSection component tests', () => {
  test('should render correctly', () => {
    render(<UsersSection />);
  });

  test('should have a title', () => {
    render(<UsersSection />);

    const title = screen.getByText(/Participants/i);

    expect(title).toBeInTheDocument();
  });

  test('should have a button to close', () => {
    render(<UsersSection />);

    const closeButton = screen.getByTestId('toggleParticipantBtn');

    expect(closeButton).toBeInTheDocument();
  });

  test('click on the button should trigger the toggleParticipant fonction passed in props', () => {
    const mockToggleParticipant = jest.fn();
    render(<UsersSection toggleParticipant={mockToggleParticipant} />);

    const closeButton = screen.getByTestId('toggleParticipantBtn');
    fireEvent.click(closeButton);

    expect(mockToggleParticipant).toHaveBeenCalledTimes(1);
  });
});

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from './HomePage';

describe('HomePage component', () => {
  test('should render without crash', () => {
    render(<HomePage />);
  });

  test('should have a title', () => {
    render(<HomePage />);

    const title = screen.getByText(/Prêt à participer ?/i);

    expect(title).toBeInTheDocument();
  });

  test('The 2 buttons should render correctly', () => {
    render(<HomePage />);

    const buttonOne = screen.getByText(/commencer la réunion/i);
    const buttonTwo = screen.getByText(/Présenter/i);

    expect(buttonOne).toBeInTheDocument();
    expect(buttonTwo).toBeInTheDocument();
  });

  test('The confirmMeeting function should be passed in props and work on button click', () => {
    const confirmMeeting = jest.fn();
    render(<HomePage confirmMeeting={confirmMeeting} />);

    const button = screen.getByText(/commencer la réunion/i);
    fireEvent.click(button);
    expect(confirmMeeting).toHaveBeenCalledTimes(1);
  });
});

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Preview from './Preview';

describe('Preview component', () => {
  test('should render without crash', () => {
    render(<Preview />);
  });

  test('should have a title', () => {
    render(<Preview />);

    const title = screen.getByText(/Prêt à participer ?/i);

    expect(title).toBeInTheDocument();
  });

  test('The 2 buttons should render correctly', () => {
    render(<Preview />);

    const buttonOne = screen.getByText(/commencer la réunion/i);
    const buttonTwo = screen.getByText(/Présenter/i);

    expect(buttonOne).toBeInTheDocument();
    expect(buttonTwo).toBeInTheDocument();
  });

  test('The confirmMeeting function should be passed in props and work on button click', () => {
    const confirmMeeting = jest.fn();
    render(<Preview confirmMeeting={confirmMeeting} />);

    const button = screen.getByText(/commencer la réunion/i);
    fireEvent.click(button);
    expect(confirmMeeting).toHaveBeenCalledTimes(1);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Message from './Message';

describe('Message', () => {
  test('Should render without crash', () => {
    render(<Message />);
  });

  test('should display datas passed as props', () => {
    const mockText = 'Hello Toto';
    const mockDate = '24 octobre 1985';
    render(<Message text={mockText} date={mockDate} />);

    const messageText = screen.getByText(/hello toto/i);
    const messageDate = screen.getByText(/24 octobre 1985/i);

    expect(messageText).toBeInTheDocument();
    expect(messageDate).toBeInTheDocument();
  });
});

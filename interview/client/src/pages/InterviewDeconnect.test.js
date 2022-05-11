import React from 'react';
import { render, screen } from '@testing-library/react';
import InterviewDeconnect from './InterviewDeconnect';

test('tcheck value in InterviewDeconnect', () => {
  render(<InterviewDeconnect />);
  const targetButton = screen.ByTestId('#button-reunion');
  expect(targetButton).toBeInTheDocument();
});

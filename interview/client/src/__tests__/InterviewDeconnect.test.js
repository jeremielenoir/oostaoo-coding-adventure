import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import InterviewDeconnect from '../pages/InterviewDeconnect';
import { EndPointContext } from '../useContext';

describe('InterviewDeconnect component', () => {
  test('Should render without crash', () => {
    render(
      <BrowserRouter>
        <InterviewDeconnect />
      </BrowserRouter>
    );

    const youLeftMeeting = screen.getByText(/vous avez quitté la réunion/i);
    expect(youLeftMeeting).toBeInTheDocument();
  });

  test('The button should render correctly', () => {
    render(
      <BrowserRouter>
        <InterviewDeconnect />
      </BrowserRouter>
    );

    const button = screen.getByText(/réintégrer la réunion/i);
    expect(button).toBeInTheDocument();
  });

  test('The text passed with EndPointContext should appear on screen', () => {
    const mockContext = 'Toto';
    render(
      <BrowserRouter>
        <EndPointContext.Provider value={[mockContext]}>
          <InterviewDeconnect />
        </EndPointContext.Provider>
      </BrowserRouter>
    );

    const title = screen.getByText('Toto');
    expect(title).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import LoggedOffPage from './LoggedOffPage';
import { EndPointContext } from '../../useContext';

describe('LoggedOffPage component', () => {
  test('Should render without crash', () => {
    render(
      <BrowserRouter>
        <LoggedOffPage />
      </BrowserRouter>
    );

    const youLeftMeeting = screen.getByText(/vous avez quitté la réunion/i);
    expect(youLeftMeeting).toBeInTheDocument();
  });

  test('The button should render correctly', () => {
    render(
      <BrowserRouter>
        <LoggedOffPage />
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
          <LoggedOffPage />
        </EndPointContext.Provider>
      </BrowserRouter>
    );

    const title = screen.getByText('Toto');
    expect(title).toBeInTheDocument();
  });
});

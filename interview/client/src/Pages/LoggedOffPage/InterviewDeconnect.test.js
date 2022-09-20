import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import LoggedOffPage from './LoggedOffPage';

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

    const button = screen.getByText(/Retour vers l'accueil/i);
    expect(button).toBeInTheDocument();
  });
});

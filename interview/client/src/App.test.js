// TO DO (MISE EN COMMENTAIRE POUR RESPCTER LES NORMES ESLINT)

import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders react app', () => {
  console.log('getbytext');
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
  describe('react router, /rooms/:hash || /InterviewDeconnect', () => {});
});

// test('zero', () => {
//   const z = 0;
//   expect(z).not.toBeNull();
//   expect(z).toBeDefined();
//   expect(z).not.toBeUndefined();
//   expect(z).not.toBeTruthy();
//   expect(z).toBeFalsy();
// });

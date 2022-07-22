import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import App from './App';

describe('App tests', () => {
  test('App renders correctly', () => {
    render(<App />);
  });
});

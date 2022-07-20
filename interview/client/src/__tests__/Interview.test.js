import React from 'react';
import { render } from '@testing-library/react';
import Interview from '../pages/Interview';

describe('Interview component tests', () => {
  test('renders correctly', () => {
    render(<Interview />);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import UserLine from './UserLine';

describe('UserLine component tests', () => {
  test('should render correctly', () => {
    render(<UserLine name="Toto" />);
  });

  test('should have an avatar representing the first letter of the name passed in props', () => {
    render(<UserLine name="Toto" />);

    const avatar = screen.getByText('T');

    expect(avatar).toBeInTheDocument();
  });

  test('should display the name passed in props', () => {
    render(<UserLine name="Toto" />);

    const userName = screen.getByText('Toto');

    expect(userName).toBeInTheDocument();
  });

  test('if no secondary props there should not be secondary text', () => {
    render(<UserLine name="Toto" />);

    const text = screen.queryByText(/secondary text/i);

    expect(text).not.toBeInTheDocument();
  });

  test('if secondary props there should be secondary text', () => {
    render(<UserLine name="Toto" secondary="Tutu" />);

    const text = screen.queryByText(/secondary text/i);

    expect(text).toBeInTheDocument();
  });
});

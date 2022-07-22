import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import UsersList from './UsersList';

describe('UsersList component tests', () => {
  test('should render correctly', () => {
    render(<UsersList />);
  });

  test('should render a list of users', () => {
    render(<UsersList />);

    const user = screen.getByText('Jérémie');

    expect(user).toBeInTheDocument();
  });
});

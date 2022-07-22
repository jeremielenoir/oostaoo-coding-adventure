import React from 'react';
import { render } from '@testing-library/react';

import UsersList from './UsersList';

describe('UsersList component tests', () => {
  test('should render correctly', () => {
    render(<UsersList />);
  });
});

import React from 'react';
import { render } from 'react-dom';

import List from '@material-ui/core/List';

import UsersList from './UsersList';

// next line is because UserLine basically is just a bunch of MUI components and so is not considered as a DOM element
// without this setup the test will console the "Target container is not a DOM element" error
jest.mock('react-dom', () => {
  return { render: jest.fn() };
});

describe('UsersList component tests', () => {
  test('should render correctly', () => {
    render(<UsersList />);
  });

  test('List MUI component should render', () => {
    render(<List />);
  });
});

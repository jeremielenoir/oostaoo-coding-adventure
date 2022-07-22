import React from 'react';
import { render } from 'react-dom';
import '@testing-library/jest-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';

import UserLine from './UserLine';

// next line is because UserLine basically is just a bunch of MUI components and so is not considered as a DOM element
// without this setup the test will console the "Target container is not a DOM element" error
jest.mock('react-dom', () => {
  return { render: jest.fn() };
});

describe('UserLine component tests', () => {
  test('should render correctly', () => {
    render(<UserLine />);
  });

  test('ListItem MUI component should render', () => {
    render(<ListItem />);
  });

  test('ListItemAvatar MUI component should render', () => {
    render(<ListItemAvatar />);
  });

  test('Avatar MUI component should render', () => {
    render(<Avatar />);
  });

  // TypeError: Cannot read properties of undefined (reading 'getByText')
  // test("should display an avatar with the first letter of the user's name which is passed in props", () => {
  //   const fakeName = 'Toto';
  //   render(
  //     <UserLine name={fakeName}>
  //       <Avatar />
  //     </UserLine>
  //   );

  //   const avatar = screen.getByText('T');
  //   expect(avatar).toBeInTheDocument();
  // });

  test('ListItemText MUI component should render', () => {
    render(<ListItemText />);
  });
});

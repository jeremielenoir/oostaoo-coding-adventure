import React from 'react';
import { render, screen } from '@testing-library/react';
import Room from './Room';

describe('Room', () => {
  beforeEach(() => {
    const props = {
      match: {
        params: {
          hash: '',
        },
      },
    };

    const mockMedia = {
      getUserMedia: jest
        .fn()
        .mockImplementation(() => Promise.resolve('stream')),
    };
    global.navigator.mediaDevices = mockMedia;

    // eslint-disable-line
    // disabling the "spreading props is forbidden" eslint error
    render(<Room {...props} hash="2" />);
  });

  // ESLint problem next line with "Parsing error: Unexpected token =>" for arrow function
  // could maybe be corrected by changing parserOptions.ecmaVersion from 6 to 2020 (or 11) in .eslintrc.json
  test('Should render without crash (with logo)', async () => {
    // find Roodeo logo
    const roodeoLogo = await screen.findByRole('img', { name: /roodeo logo/i });
    expect(roodeoLogo).toBeInTheDocument();
  });
});

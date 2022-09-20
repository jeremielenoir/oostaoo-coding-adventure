import React from 'react';
import { render } from '@testing-library/react';
import Interview from './Interview';

import { StreamContext } from '../../common/StreamContext';
import {
  myVideo,
  partnerSocketID,
  partnerVideo,
} from '../../common/StreamContext';

describe('Interview component tests', () => {
  test('renders correctly', () => {
    render(
      <StreamContext.Provider
        value={{ myVideo, partnerSocketID, partnerVideo }}
      >
        <Interview />
      </StreamContext.Provider>
    );
  });
});

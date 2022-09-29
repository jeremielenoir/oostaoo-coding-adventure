import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Preview from './Preview';

import { StreamContext } from '../../common/StreamContext';
import { myVideo, confirmMeeting } from '../../common/StreamContext';

describe('Preview component', () => {
  test('should render without crash', () => {
    render(
      <StreamContext.Provider value={{ myVideo, confirmMeeting }}>
        <Preview />
      </StreamContext.Provider>
    );
  });

  test('Should render without crash (with logo)', async () => {
    // find Roodeo logo
    render(
      <StreamContext.Provider value={{ myVideo, confirmMeeting }}>
        <Preview />
      </StreamContext.Provider>
    );
    const roodeoLogo = await screen.findByRole('img');
    expect(roodeoLogo).toBeInTheDocument();
  });

  test('should have a title', () => {
    render(
      <StreamContext.Provider value={{ myVideo, confirmMeeting }}>
        <Preview />
      </StreamContext.Provider>
    );

    const title = screen.getByText(/Prêt à entrer dans l'arène ?/i);

    expect(title).toBeInTheDocument();
  });

  test('The 2 buttons should render correctly', () => {
    render(
      <StreamContext.Provider value={{ myVideo, confirmMeeting }}>
        <Preview />
      </StreamContext.Provider>
    );

    const buttonOne = screen.getByText(/commencer la réunion/i);
    const buttonTwo = screen.getByText(/Présenter/i);

    expect(buttonOne).toBeInTheDocument();
    expect(buttonTwo).toBeInTheDocument();
  });

  test('The confirmMeeting function should be passed in props and work on button click', () => {
    const confirmMeeting = jest.fn();
    render(
      <StreamContext.Provider value={{ myVideo, confirmMeeting }}>
        <Preview confirmMeeting={confirmMeeting} />
      </StreamContext.Provider>
    );

    const button = screen.getByText(/commencer la réunion/i);
    fireEvent.click(button);
    expect(confirmMeeting).toHaveBeenCalledTimes(1);
  });
});

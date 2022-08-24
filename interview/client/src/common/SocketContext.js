import React, { createContext } from 'react';
import PropTypes from 'prop-types';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const APILocation = process.env.REACT_APP_REST_API_LOCATION;

  return (
    <SocketContext.Provider value={{ APILocation }}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = { children: PropTypes.object };

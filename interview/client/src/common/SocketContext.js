import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';
import dico from './dico';

const { SOCKET_FROMAPI } = dico;

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const APILocation = process.env.REACT_APP_REST_API_LOCATION;
  const socket = socketIOClient(APILocation);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    socket.on(SOCKET_FROMAPI, (data) => {
      setChatMessages(data);
    });
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        chatMessages,
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = { children: PropTypes.object };

import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

/* MUI components */
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';

import { SocketContext } from '../../common/SocketContext';

/* Custom components */
import Message from '../Message/Message';

/* Style */
import './chatSection.css';

/* Socket variables */
import dico from '../../common/dico';

const { SOCKET_NEW_MESSAGE } = dico;

/* Component definition */
const ChatSection = ({ toggleMessage }) => {
  const { socket, chatMessages } = useContext(SocketContext);
  const [currentMessage, setCurrentMessage] = useState('');
  const onChangeMessage = (e) => {
    setCurrentMessage(e.target.value);
  };

  const sendMessage = () => {
    if (currentMessage) {
      socket.emit(SOCKET_NEW_MESSAGE, currentMessage);
      setCurrentMessage('');
    }
  };

  const sendMessageWithEnterKey = (event) => {
    if (event.key === 'Enter') {
      socket.emit(SOCKET_NEW_MESSAGE, currentMessage);
      setCurrentMessage('');
    }
  };

  // console.log('current message => ', currentMessage);

  return (
    <div className="chat-text">
      <div className="title-chat-text">
        <span> Messages dans l'appel </span>
        <CloseIcon
          id="close-icon"
          onClick={toggleMessage}
          role="button"
          // next line for test purpose
          data-testid="closeButton"
        />
      </div>
      <div className="messagesList">
        {/* eslint-disable-next-line */}

        {chatMessages.map((message) => (
          <div className="message-and-date" key={message.id}>
            <Message date={message.date} />
            <Message text={message.text} />
          </div>
        ))}

      </div>

      <div className="messageWriting">
        <TextField
          required
          id="message"
          label="Message"
          value={currentMessage}
          focused
          onChange={onChangeMessage}
          onKeyDown={sendMessageWithEnterKey}
          variant="outlined"
          // next line is for testing purpose
          inputProps={{ 'data-testid': 'textfield' }}
        />
        <Button
          id="send"
          size="small"
          color="primary"
          onClick={sendMessage}
          style={{
            maxWidth: '40px',
            maxHeight: '56px',
            minWidth: '40px',
            minHeight: '56px',
            marginLeft: '5px',
          }}
          role="button"
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  );
};

/* Proptypes */
ChatSection.propTypes = { toggleMessage: PropTypes.func };

export default ChatSection;

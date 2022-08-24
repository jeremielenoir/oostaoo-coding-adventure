import React, { useState } from 'react';
import PropTypes from 'prop-types';

/* MUI components */
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';

/* Custom components */
import Message from '../Message/Message';

/* Style */
import './chatSection.css';

// Socket variables
import dico from '../../common/dico';

const { SOCKET_NEW_MESSAGE } = dico;

/* Component definition */
const ChatSection = ({ socket, toggleMessage, messages }) => {
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
        {messages.response.length > 0 &&
          messages.response.map((message) => (
            <div className="message-and-date" key={Math.random()}>
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
          variant="outlined"
          // next line is for testing purpose
          inputProps={{ 'data-testid': 'textfield' }}
        />
        <Button
          id="send"
          size="small"
          color="primary"
          // we shouldn't have the sendMessage function here since it's already bound to the form via onSubmit
          // should be a type='submit' button instead
          onClick={sendMessage}
          style={{
            maxWidth: '40px',
            maxHeight: '56px',
            minWidth: '40px',
            minHeight: '56px',
            marginLeft: '5px',
          }}
          // added a role button for screen readers and test purpose
          role="button"
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  );
};

/* Proptypes */
ChatSection.propTypes = {
  toggleMessage: PropTypes.func,
  // if there are multiple elements in the object, should use the PropTypes.shape property instead
  messages: PropTypes.object, // probably to change into array once we get the right response
  socket: PropTypes.object,
};

export default ChatSection;

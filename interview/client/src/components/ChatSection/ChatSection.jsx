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

/* Component definition */
const ChatSection = ({ socket, toggleMessage, messages, inputRef }) => {
  const [currentMessage, setCurrentMessage] = useState('');

  const onChangeMessage = (e) => {
    setCurrentMessage(e.target.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (currentMessage) {
      socket.emit('newMessage', currentMessage);
      setCurrentMessage('');
    }
  };

  console.log('current message => ', currentMessage);

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
        {messages.response.length > 0 &&
          messages.response.map((message) => (
            <Message
              // added the missing key prop, mandatory in React with map() for better render management
              key={Math.random()}
              text={message.text}
              date={message.date}
            />
          ))}
      </div>

      <div className="messageWriting">
        <form className="messageForm" onSubmit={(e) => sendMessage(e)}>
          <TextField
            required
            id="message"
            label="Message"
            value={currentMessage}
            ref={inputRef}
            onChange={(e) => onChangeMessage(e)}
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
            onClick={(e) => sendMessage(e)}
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
        </form>
      </div>
    </div>
  );
};

/* Proptypes */
ChatSection.propTypes = {
  toggleMessage: PropTypes.func,
  // if there are multiple elements in the object, should use the PropTypes.shape property instead
  messages: PropTypes.object, // probably to change into array once we get the right response
  inputRef: PropTypes.func,
};

export default ChatSection;

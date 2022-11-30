import React from 'react';

/* MUI components */
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';

import { useDispatch, useSelector } from 'react-redux';

/* Custom components */
import Message from '../Message/Message';

/* Style */
import './chatSection.css';

/* Socket variables */
import {
  currentMessage,
  dataMessage,
  toggleActionMessage,
} from '../../redux/features/message/messageSlice';
import { request, fail, success } from '../../redux/features/socket/socketSlice';
import dico from '../../common/dico';
import socketIOClient from 'socket.io-client';

const APILocation = process.env.REACT_APP_REST_API_LOCATION;
const { SOCKET_FROMAPI } = dico;
const socket = socketIOClient(APILocation);

/* Component definition */
const ChatSection = () => {
  const messageValue = useSelector((state)=> state.message.messageChat)
  const currentMessageValue = useSelector((state)=> state.message.currentMsg)
  const dispatch = useDispatch();

  const onChangeMessage = (e) => {
    dispatch(currentMessage(e.target.value))
  };

// Get the values from the back
const getDataMsg = () => {
  socket.on(SOCKET_FROMAPI, (data) => {
    dispatch(dataMessage(data));
  });
}

  const sendMessage = () => {
    if (currentMessageValue) {
      dispatch(request(currentMessageValue))
      dispatch(currentMessage(""))
      getDataMsg()
    }
  };

  const sendMessageWithEnterKey = (event) => {
    if (event.key === 'Enter') {
      sendMessage()
      getDataMsg()
    }
  };

  return (
    <div className="chat-text">
      <div className="title-chat-text">
        <span> Messages dans l'appel </span>
        <CloseIcon
          id="close-icon"
          className="close-icon"
          onClick={() => dispatch(toggleActionMessage())}
          role="button"
          // next line for test purpose
          data-testid="closeButton"
        />
      </div>
      <div className="messagesList">
        {/* eslint-disable-next-line */}
        {messageValue.map((message) => (
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
          value={currentMessageValue}
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
          role="button"
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  );
};

export default ChatSection;

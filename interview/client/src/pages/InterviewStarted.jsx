import React, { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MicOffIcon from '@material-ui/icons/MicOff';
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import GroupIcon from '@material-ui/icons/Group';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import CloseIcon from '@material-ui/icons/Close';
import CallEndIcon from '@material-ui/icons/CallEnd';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core//Modal';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import '../assets/css/InterviewStarted.css';
import { Link } from 'react-router-dom';

import { EndPointContext } from '../useContext';

import Message from '../components/Message';

function InterviewStarted({
  userVideo,
  partnerVideo,
  micToggle,
  micOn,
  // groupToggle,
  // chatToggle,
}) {
  const [secondary] = useState(false);
  const inputRef = useRef();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState(false);
  console.log('chat', chat);
  const [participant, setParticipant] = useState(false);
  console.log('participant', participant);

  const [messages, setMessages] = useState({
    response: false,
    // endpoint: 'http://localhost:8000',
  }); // Ngrok adress
  // const { endpoint } = messages;
  // const endpointPort = process.env.ENDPOINT;
  // console.log('endpointPort', endpointPort);

  const endpoint = useContext(EndPointContext);
  const socket = socketIOClient(endpoint);
  console.log('endpoint', endpoint);

  useEffect(() => {
    // inputRef.current.focus();
    socket.on('FromAPI', (data) => setMessages({ response: data }));
  }, [socket]);

  const onChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('newMessage', message);
      setMessage('');
    }
  };

  const toggleMessage = () => {
    chat ? setChat(false) : setChat(true);
    participant && setParticipant(false);
  };

  const toggleParticipant = () => {
    participant ? setParticipant(false) : setParticipant(true);
    chat && setChat(false);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="interview-started">
      <div className="container-video-chat">
        <div className="chat-video">
          <div className="partner-video">
            <video controls autoPlay ref={partnerVideo}><track kind="captions" /></video>
          </div>

          <div className="user-video">
            <video muted autoPlay ref={userVideo} />
          </div>
          <div className="icons">
            <div id="icon-mic">
              {micOn ? (
                <MicOffIcon
                  className="mic"
                  color="primary"
                  onClick={() => micToggle()}
                />
              ) : (
                <MicIcon
                  className="mic"
                  color="primary"
                  onClick={() => micToggle()}
                />
              )}
            </div>
            <div>
              <CallEndIcon color="secondary" />
            </div>
          </div>
        </div>
        {chat ? (
          <div className="chat-text">
            <div className="title-chat-text">
              <span> Messages dans l'appel </span>
              <CloseIcon id="close-icon" onClick={toggleMessage} />
            </div>
            <div className="messagesList">
              {messages.response.length > 0
                && messages.response.map((message) => (
                  <Message text={message.text} date={message.date} />
                ))}
            </div>

            <div className="messageWriting">
              <form className="messageForm" onSubmit={(e) => sendMessage(e)}>
                <TextField
                  required
                  id="message"
                  label="Message"
                  value={message}
                  ref={inputRef}
                  onChange={(e) => onChangeMessage(e)}
                  variant="outlined"
                />
                <Button
                  id="send"
                  size="small"
                  color="primary"
                  onClick={(e) => sendMessage(e)}
                  style={{
                    maxWidth: '40px',
                    maxHeight: '56px',
                    minWidth: '40px',
                    minHeight: '56px',
                    marginLeft: '5px',
                  }}
                >
                  <SendIcon />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          ''
        )}
        {participant ? (
          <div className="users-room">
            <div className="title-users-room">
              <span> Participants </span>
              <CloseIcon id="close-icon" onClick={toggleParticipant} />
            </div>
            <div className="search-users" />
            <div className="users-list">
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>U </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    className="list-item-text"
                    primary="UserName"
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              </List>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>

      <footer className="container-interview-footer">
        <div className="icons">
          <div id="icon-mic">
            {micOn ? (
              <MicOffIcon
                className="mic"
                color="primary"
                onClick={() => micToggle()}
              />
            ) : (
              <MicIcon
                className="mic"
                color="primary"
                onClick={() => micToggle()}
              />
            )}
          </div>
          <div>
            <CallEndIcon color="secondary" onClick={handleOpen} />
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="box-modal">
                <div className="header-modal">
                  <Button onClick={handleClose}>
                    <CloseIcon id="close-icon" />
                  </Button>
                </div>

                <div className="content-modal">
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Mettre fin à l'appel vidéo ?
                  </Typography>
                  <span className="text-modal">
                    {' '}
                    Vous quitterez la réunion après validation.
                  </span>
                </div>

                <div className="footer-modal">
                  <Button onClick={handleClose} id="cancel" variant="outlined">
                    Annuler
                  </Button>
                  <Link id="button-leave" to="/InterviewDeconnect">
                    <Button variant="contained" color="secondary">
                      Quitter
                    </Button>
                  </Link>
                </div>
              </Box>
            </Modal>
          </div>
        </div>

        <div className="footer-left-button">
          <button id="group-icon" className="footer-icons">
            <GroupIcon onClick={toggleParticipant} />
            {' '}
          </button>
          <button id="chat-icon" className="footer-icons">
            <QuestionAnswerIcon onClick={toggleMessage} />
          </button>
        </div>
      </footer>
    </div>
  );
}

InterviewStarted.propTypes = {
  userVideo: PropTypes.object,
  partnerVideo: PropTypes.object,
  micToggle: PropTypes.func,
  micOn: PropTypes.bool,
};

export default InterviewStarted;

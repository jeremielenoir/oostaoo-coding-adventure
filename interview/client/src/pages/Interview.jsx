import React, { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';

import '../assets/css/Interview.css';

import { EndPointContext } from '../useContext';

import ChatSection from '../components/ChatSection';
import CommandsBar from '../components/CommandsBar';
import ParticipantsSection from '../components/ParticipantsSection';

function Interview({
  userVideo,
  partnerVideo,
  micToggle,
  micOn
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
  const [open, setOpen] = useState(false);

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
        </div>
        {chat ? (
          <ChatSection 
            toggleMessage={toggleMessage} 
            messages={messages} 
            message={message} 
            sendMessage={sendMessage} 
            inputRef={inputRef} 
            onChangeMessage={onChangeMessage}
          />
        ) : (
          ''
        )}
        {participant ? (
          <ParticipantsSection toggleParticipant={toggleParticipant} secondary={secondary} />
        ) : (
          ''
        )}
      </div>

      <CommandsBar 
        userVideo={userVideo} 
        partnerVideo={partnerVideo} 
        micToggle={micToggle} 
        micOn={micOn} 
        handleOpen={handleOpen} 
        handleClose={handleClose} 
        toggleParticipant={toggleParticipant} 
        toggleMessage={toggleMessage} 
        open={open}
      />

    </div>
  );
}

Interview.propTypes = {
  userVideo: PropTypes.object,
  partnerVideo: PropTypes.object,
  micToggle: PropTypes.func,
  micOn: PropTypes.bool,
};

export default Interview;

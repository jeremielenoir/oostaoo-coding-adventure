import React, { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';
import { EndPointContext } from '../../useContext';

/* Custom Components */
import ChatSection from '../ChatSection/ChatSection';
import CommandsBar from '../CommandsBar/CommandsBar';
import UsersSection from '../UsersSection/UsersSection';

/* Style */
import './interview.css';

// Socket variables
import dico from '../../common/dico';

const { SOCKET_FROMAPI } = dico;

function Interview({
  userVideo,
  partnerVideo,
  micToggle,
  micOn,
  // groupToggle,
  // chatToggle,
}) {
  const [secondary] = useState(false); // a state with no setter function associated ? why ?
  const inputRef = useRef();
  const [chat, setChat] = useState(false);
  // eslint-disable-next-line
  console.log('chat', chat);
  const [participant, setParticipant] = useState(false);
  // eslint-disable-next-line
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
  // eslint-disable-next-line
  console.log('endpoint', endpoint);

  useEffect(() => {
    // inputRef.current.focus();
    socket.on(SOCKET_FROMAPI, (data) => setMessages({ response: data }));
  }, [socket]);

  const toggleMessage = () => {
    chat ? setChat(false) : setChat(true);
    participant && setParticipant(false);
  };
  const toggleParticipant = () => {
    participant ? setParticipant(false) : setParticipant(true);
    chat && setChat(false);
  };

  return (
    <div className="interview-started">
      <div className="container-video-chat">
        <div className="chat-video">
          <div className="partner-video">
            <video controls autoPlay ref={partnerVideo}>
              <track kind="captions" />
            </video>
          </div>
          <div className="user-video">
            <video muted autoPlay ref={userVideo} />
          </div>
        </div>
        {chat ? (
          <ChatSection
            socket={socket}
            toggleMessage={toggleMessage}
            messages={messages}
            inputRef={inputRef}
          />
        ) : (
          ''
        )}
        {participant ? (
          <UsersSection
            toggleParticipant={toggleParticipant}
            secondary={secondary}
          />
        ) : (
          ''
        )}
      </div>

      <CommandsBar
        userVideo={userVideo}
        partnerVideo={partnerVideo}
        micToggle={micToggle}
        micOn={micOn}
        toggleParticipant={toggleParticipant}
        toggleMessage={toggleMessage}
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

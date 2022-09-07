import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
// import socketIOClient from 'socket.io-client';

/* Custom Components */
import ChatSection from '../ChatSection/ChatSection';
import CommandsBar from '../CommandsBar/CommandsBar';
import UsersSection from '../UsersSection/UsersSection';

/* Style */
import './interview.css';

function Interview({
  userVideo,
  partnerVideo,
  micToggle,
  micOn,
  partnerID,
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

  // const endpoint = useContext(EndPointContext);
  // console.log('endpoint', endpoint);

  const toggleMessage = () => {
    setChat(!chat);
    participant && setParticipant(false);
  };
  const toggleParticipant = () => {
    setParticipant(!participant);
    chat && setChat(false);
  };

  return (
    <div className="interview-started">
      <div className="container-video-chat">
        <div className="chat-video">
          <div className="partner-video">
            <p className="partner-id">PartnerID :</p>
            <p className="partner-id">{partnerID}</p>
            <video controls autoPlay ref={partnerVideo}>
              <track kind="captions" />
            </video>
          </div>
          <div className="user-video">
            <video muted autoPlay ref={userVideo} />
          </div>
        </div>
        {chat ? (
          <ChatSection toggleMessage={toggleMessage} inputRef={inputRef} />
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
  partnerID: PropTypes.string,
};

export default Interview;

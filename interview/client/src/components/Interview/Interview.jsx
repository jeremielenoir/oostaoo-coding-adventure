import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';

/* Custom Components */
import ChatSection from '../ChatSection/ChatSection';
import CommandsBar from '../CommandsBar/CommandsBar';
import UsersSection from '../UsersSection/UsersSection';

/* Style */
import './interview.css';
import { StreamContext } from '../../common/StreamContext';

function Interview({
  micToggle,
  micOn,
  // groupToggle,
  // chatToggle,
}) {
  const { myVideo, partnerSocketID, partnerVideo } = useContext(StreamContext);

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
            <p className="partner-id">{partnerSocketID}</p>
            <video controls autoPlay ref={partnerVideo}>
              <track kind="captions" />
            </video>
          </div>
          <div className="user-video">
            <video muted autoPlay ref={myVideo} />
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
        userVideo={myVideo}
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
  micToggle: PropTypes.func,
  micOn: PropTypes.bool,
};

export default Interview;

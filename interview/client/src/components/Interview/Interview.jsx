import React, { useState, useRef, useContext } from 'react';

/* Custom Components */
import ChatSection from '../ChatSection/ChatSection';
import CommandsBar from '../CommandsBar/CommandsBar';
import UsersSection from '../UsersSection/UsersSection';

/* Style */
import './interview.css';
import { StreamContext } from '../../common/StreamContext';

function Interview() {
  const { myVideo, partnerSocketID, partnerVideo } = useContext(StreamContext);

  const inputRef = useRef();

  const [secondary] = useState(false); // a state with no setter function associated ? why ?
  const [chat, setChat] = useState(false);
  const [participant, setParticipant] = useState(false);

  return (
    <div className="interview-started">
      <div className="container-video-chat">
        <div className="chat-video">
          <div className="partner-video">
            <p className="partner-id">PartnerID :</p>
            <p className="partner-id">{partnerSocketID}</p>
            <video autoPlay ref={partnerVideo}>
              <track kind="captions" />
            </video>
          </div>
          <div className="user-video">
            <video muted autoPlay ref={myVideo} />
          </div>
        </div>
        {chat && <ChatSection inputRef={inputRef} />}
        {participant && <UsersSection secondary={secondary} />}
      </div>

      <CommandsBar setChat={setChat} setParticipant={setParticipant} />
    </div>
  );
}

export default Interview;

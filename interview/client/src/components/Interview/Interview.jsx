import React, { useState, useRef, useContext } from 'react';
import { useSelector } from 'react-redux';

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

  const toggleMessage = useSelector((state) => state.message.toggleMessage);
  const toggleUser = useSelector((state) => state.message.toggleUserList);

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
        {toggleMessage && <ChatSection inputRef={inputRef} />}
        {toggleUser && <UsersSection secondary={secondary} />}
      </div>

      <CommandsBar />
    </div>
  );
}

export default Interview;

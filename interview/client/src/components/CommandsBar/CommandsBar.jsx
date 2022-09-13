import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

/* MUI components */
import MicOffIcon from '@material-ui/icons/MicOff';
import MicIcon from '@material-ui/icons/Mic';
import GroupIcon from '@material-ui/icons/Group';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import CallEndIcon from '@material-ui/icons/CallEnd';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

/* Custom components */
import ModalLeaveInterview from '../ModalLeaveInterview/ModalLeaveInterview';

/* Style */
import './commandsBar.css';
import { StreamContext } from '../../common/StreamContext';

/* Component definition */
const CommandsBar = ({
  toggleParticipant,
  toggleMessage,
}) => {
  const {micOn, micToggle, videoCamOn, videoCamToggle} = useContext(StreamContext)
  /* State */
  const [open, setOpen] = useState(false);

  /* Events */
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <footer className="container-interview-footer">
      <div className="call-icons">
        <div id="icon-mic">
          {micOn ? (
            <MicOffIcon
              className="mic"
              color="primary"
              onClick={() => micToggle()}
              data-testid="micOffBtn"
            />
          ) : (
            <MicIcon
              className="mic"
              color="primary"
              onClick={() => micToggle()}
              data-testid="micOnBtn"
            />
          )}
        </div>
        <div id="icon-VideoCam">
          {videoCamOn ? (
            <VideocamOffIcon
              className="videoCam"
              color="primary"
              onClick={() => videoCamToggle()}
              data-testid="videoCamOffBtn"
            />
          ) : (
            <VideocamIcon
              className="videoCam"
              color="primary"
              onClick={() => videoCamToggle()}
              data-testid="videoCamOnBtn"
            />
          )}
        </div>
        <div>
          <CallEndIcon
            color="secondary"
            onClick={handleOpen}
            data-testid="callEndButton"
          />
          <ModalLeaveInterview open={open} handleClose={handleClose} />
        </div>
      </div>

      <div className="other-icons">
        <button type="button" id="group-icon" className="footer-icons">
          <GroupIcon onClick={toggleParticipant} />
        </button>
        <button
          type="button"
          id="chat-icon"
          className="footer-icons"
          onClick={toggleMessage}
          data-testid="chat-icon"
        >
          <QuestionAnswerIcon />
        </button>
      </div>
    </footer>
  );
};

/* Proptypes */
CommandsBar.propTypes = {
  micToggle: PropTypes.func,
  micOn: PropTypes.bool,
  toggleParticipant: PropTypes.func,
  toggleMessage: PropTypes.func,
};

export default CommandsBar;

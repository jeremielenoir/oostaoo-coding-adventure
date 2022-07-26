import React, { useState } from 'react';
import PropTypes from 'prop-types';

/* MUI components */
import MicOffIcon from '@material-ui/icons/MicOff';
import MicIcon from '@material-ui/icons/Mic';
import GroupIcon from '@material-ui/icons/Group';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import CallEndIcon from '@material-ui/icons/CallEnd';

/* Custom components */
import ModalLeaveInterview from '../ModalLeaveInterview/ModalLeaveInterview';

/* Style */
import './commandsBar.css';

/* Component definition */
const CommandsBar = ({
  micToggle,
  micOn,
  toggleParticipant,
  toggleMessage,
}) => {
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
          <ModalLeaveInterview open={open} handleClose={handleClose} />
        </div>
      </div>

      <div className="other-icons">
        <button type="button" id="group-icon" className="footer-icons">
          <GroupIcon onClick={toggleParticipant} />{' '}
        </button>
        <button type="button" id="chat-icon" className="footer-icons">
          <QuestionAnswerIcon onClick={toggleMessage} />
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

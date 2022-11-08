import React, { useState, useContext, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import ModalLeaveInterview from '../ModalLeaveInterview/ModalLeaveInterview';

/* Style */
import './commandsBar.css';
import { StreamContext } from '../../common/StreamContext';
import {
  toggleActionMessage,
  toggleActionUserList,
} from '../../redux/features/message/messageSlice';

/* Component definition */
const CommandsBar = ({ setChat, setParticipant }) => {
  const { micOn, micToggle, videoCamOn, videoCamToggle } = useContext(StreamContext);

  const dispatch = useDispatch();

  /* State */
  const [open, setOpen] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState('');
  const [openUserModal, setOpenUserModal] = useState('');

  /* Events */
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const toggleValue = useSelector((state) => state.message.toggleMessage);
  const toggleValueUser = useSelector((state) => state.message.toggleUserList);

  setChat(openMessageModal);
  setParticipant(openUserModal);

  useEffect(() => {
    setOpenMessageModal(toggleValue);
    setOpenUserModal(toggleValueUser);
  }, [toggleValue, openMessageModal, setChat, toggleValueUser, openUserModal]);

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
        <button
          type="button"
          // onClick={toggleParticipant}
          onClick={() => dispatch(toggleActionUserList())}
          id="group-icon"
          className="footer-icons"
        >
          <GroupIcon />
        </button>
        <button
          type="button"
          id="chat-icon"
          className="footer-icons"
          // onClick={toggleMessage}
          onClick={() => dispatch(toggleActionMessage())}
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
  setParticipant: PropTypes.func,
  setChat: PropTypes.func,
};

export default CommandsBar;

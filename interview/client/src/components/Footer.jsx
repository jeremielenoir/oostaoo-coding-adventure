import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/* MUI components */
import Button from '@material-ui/core/Button';
import MicOffIcon from '@material-ui/icons/MicOff';
import MicIcon from '@material-ui/icons/Mic';
import GroupIcon from '@material-ui/icons/Group';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import CloseIcon from '@material-ui/icons/Close';
import CallEndIcon from '@material-ui/icons/CallEnd';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core//Modal';
import Typography from '@material-ui/core/Typography';

/* Style */
import '../assets/css/Interview.css';

/* Component definition */
const Footer = ({userVideo, partnerVideo, micToggle, micOn, handleOpen, handleClose, toggleParticipant, toggleMessage, open}) => {
  return (
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
  );
}

/* Proptypes */
Footer.propTypes = {
  userVideo: PropTypes.object,
  partnerVideo: PropTypes.object,
  micToggle: PropTypes.func,
  micOn: PropTypes.bool,
  handleOpen: PropTypes.func,
  handleClose: PropTypes.func,
  toggleParticipant: PropTypes.func,
  toggleMessage: PropTypes.func,
  open: PropTypes.bool,
};

export default Footer;
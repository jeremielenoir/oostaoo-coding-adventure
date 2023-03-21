import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/* MUI components */
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core//Modal';
import Typography from '@material-ui/core/Typography';

/* Style */
import './modalLeaveInterview.css';
import { StreamContext } from '../../common/StreamContext';

function ModalLeaveInterview({ open, handleClose }) {
  const { leaveCall } = useContext(StreamContext);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="box-modal">
        <div className="header-modal">
          <Button onClick={handleClose} data-testid="closeModalBtn">
            <CloseIcon id="close-icon" />
          </Button>
        </div>

        <div className="content-modal">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Mettre fin à l'appel vidéo ?
          </Typography>
          <span className="text-modal">
            Vous quitterez la réunion après validation.
          </span>
        </div>

        <div className="footer-modal">
          <Button onClick={handleClose} id="cancel" variant="outlined">
            Annuler
          </Button>
          <Link id="button-leave" to="/LoggedOffPage">
            <Button onClick={leaveCall} variant="contained" color="secondary">
              Quitter
            </Button>
          </Link>
        </div>
      </Box>
    </Modal>
  );
}

/* Proptypes */
ModalLeaveInterview.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};

export default ModalLeaveInterview;

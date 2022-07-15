import React from 'react';
import PropTypes from 'prop-types';

/* Custom components */
import UsersList from '../components/UsersList';

/* MUI components */
import CloseIcon from '@material-ui/icons/Close';

/* Style */
import '../assets/css/Interview.css';

/* Component definition */
const UsersSection = ({ toggleParticipant, secondary }) => (
  <div className="users-room">
    <div className="title-users-room">
      <span> Participants </span>
      <CloseIcon id="close-icon" onClick={toggleParticipant} />
    </div>
    <div className="search-users" />
    <UsersList secondary={secondary}></UsersList>
  </div>
);

/* Proptypes */
UsersSection.propTypes = {
  toggleParticipant: PropTypes.func,
  secondary: PropTypes.bool,
};

export default UsersSection;

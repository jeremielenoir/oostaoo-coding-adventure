import React from 'react';
import PropTypes from 'prop-types';

/* MUI components */
import CloseIcon from '@material-ui/icons/Close';

/* Custom components */
import UsersList from '../UsersList/UsersList';

/* Style */
import './usersSection.css';

/* Component definition */
const UsersSection = ({ toggleParticipant, secondary }) => (
  <div className="users-room">
    <div className="title-users-room">
      <span> Participants </span>
      <CloseIcon
        id="close-icon"
        onClick={toggleParticipant}
        data-testid="toggleParticipantBtn"
      />
    </div>
    <div className="search-users" />
    <UsersList secondary={secondary} />
  </div>
);

/* Proptypes */
UsersSection.propTypes = {
  toggleParticipant: PropTypes.func,
  secondary: PropTypes.bool,
};

export default UsersSection;

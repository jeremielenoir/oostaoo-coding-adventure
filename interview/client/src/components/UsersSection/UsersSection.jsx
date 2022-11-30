import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

/* MUI components */
import CloseIcon from '@material-ui/icons/Close';

/* Custom components */
import UsersList from '../UsersList/UsersList';

/* Style */
import './usersSection.css';
import { toggleActionUserList } from '../../redux/features/message/messageSlice';

/* Component definition */
const UsersSection = ({ secondary }) => {
  const dispatch = useDispatch();

  return (
    <div className="users-room">
      <div className="title-users-room">
        <span> Participants </span>
        <CloseIcon
          id="close-icon"
          className="close-icon"
          // onClick={toggleParticipant}
          onClick={() => dispatch(toggleActionUserList())}
          data-testid="toggleParticipantBtn"
        />
      </div>
      <div className="search-users" />
      <UsersList secondary={secondary} />
    </div>
  );
};

/* Proptypes */
UsersSection.propTypes = { secondary: PropTypes.string, };

export default UsersSection;

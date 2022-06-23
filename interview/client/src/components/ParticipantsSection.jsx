import React from 'react';
import PropTypes from 'prop-types';

/* MUI components */
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

/* Style */
import '../assets/css/Interview.css';

/* Component definition */
const ParticipantsSection = ({toggleParticipant, secondary}) => {
  return (
    <div className="users-room">
      <div className="title-users-room">
        <span> Participants </span>
        <CloseIcon id="close-icon" onClick={toggleParticipant} />
      </div>
      <div className="search-users" />
      <div className="users-list">
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>U </Avatar>
            </ListItemAvatar>
            <ListItemText
              className="list-item-text"
              primary="UserName"
              secondary={secondary ? 'Secondary text' : null}
            />
          </ListItem>
        </List>
      </div>
    </div>
  );
}

/* Proptypes */
ParticipantsSection.propTypes = {
  toggleParticipant: PropTypes.func,
  secondary: PropTypes.bool,
};

export default ParticipantsSection;
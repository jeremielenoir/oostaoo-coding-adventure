import React from 'react';
import PropTypes from 'prop-types';

/* MUI components */
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

function UserLine({ name, secondary }) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>{name.charAt(0)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={name}
        secondary={secondary ? 'Secondary text' : null}
      />
    </ListItem>
  );
}
export default UserLine;

UserLine.propTypes = {};

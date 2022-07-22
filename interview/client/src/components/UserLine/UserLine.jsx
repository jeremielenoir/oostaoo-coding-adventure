import React from 'react';
import PropTypes from 'prop-types';

/* MUI components */
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

function UserLine({ name, secondary }) {
  // this function gives a random color for every user, but it changes everytime the component is mounted.
  // it should be called higher in the tree.
  const randomColor = () => {
    let hex = Math.floor(Math.random() * 0xffffff);
    let color = `#${hex.toString(16)}`;
    return color;
  };
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar style={{ backgroundColor: randomColor() }}>
          {name.charAt(0)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={name}
        secondary={secondary ? 'Secondary text' : null}
      />
    </ListItem>
  );
}
export default React.memo(UserLine);

UserLine.propTypes = {};

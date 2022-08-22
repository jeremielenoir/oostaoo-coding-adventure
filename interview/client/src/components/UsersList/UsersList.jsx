import React from 'react';
import PropTypes from 'prop-types';

/* MUI components */
import List from '@material-ui/core/List';

/* Custom components */
import UserLine from '../UserLine/UserLine';

/* Style */
import './users-list.css';

function UsersList({ secondary }) {
  // Fake data to test required behaviour on initial letter for avatar.
  // Should be replaced with true data from the call with probably more informations.
  let listOfUsers = [
    { firstName: 'Jérémie', id: 1234 },
    { firstName: 'Cécilia', id: 2345 },
    { firstName: 'Yannick', id: 3456 },
    { firstName: 'Camille', id: 4567 },
    { firstName: 'Julien', id: 5678 },
    { firstName: 'Benjamin', id: 6789 },
    { firstName: 'William', id: 78910 },
  ];
  //

  listOfUsers = listOfUsers.map((user) => (
    <UserLine key={user.id} name={user.firstName} secondary={secondary} />
  ));
  return (
    <div className="users-list">
      <List>{listOfUsers}</List>
    </div>
  );
}
export default UsersList;

UsersList.propTypes = { secondary: PropTypes.string };

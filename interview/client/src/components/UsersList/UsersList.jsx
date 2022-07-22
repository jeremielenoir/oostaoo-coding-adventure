import React from 'react';

/* Custom components */
import UserLine from '../UserLine/UserLine';

/* MUI components */
import List from '@material-ui/core/List';

/* Style */
import './users-list.css';

function UsersList({ secondary }) {
  // Fake data to test required behaviour on initial letter for avatar.
  // Should be replaced with true data from the call with probably more informations.
  let listOfUsers = [
    'Jérémie',
    'Cécilia',
    'Yannick',
    'Camille',
    'Julien',
    'Benjamin',
    'William',
  ];
  //

  listOfUsers = listOfUsers.map((index, name) => (
    <UserLine key={index} name={name} secondary={secondary} />
  ));
  return (
    <div className="users-list">
      <List>{listOfUsers}</List>
    </div>
  );
}
export default UsersList;

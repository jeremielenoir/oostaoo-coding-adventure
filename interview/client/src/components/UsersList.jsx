import React from 'react';
import PropTypes from 'prop-types';

/* Custom components */
import UserLine from '../components/UserLine';

/* MUI components */
import List from '@material-ui/core/List';

/* Style */
import '../assets/css/users-list.css';

function UsersList({ secondary }) {
  // Fake data to test required behaviour on initial letter for avatar.
  // Should be replaced with true data from the call with probably more informations.
  let listOfUsers = ['Jérémie', 'Cécilia', 'Yannick'];
  //

  listOfUsers = listOfUsers.map((name) => (
    <UserLine name={name} secondary={secondary} />
  ));
  return (
    <div className="users-list">
      <List>{listOfUsers}</List>
    </div>
  );
}
export default UsersList;

UsersList.propTypes = {};

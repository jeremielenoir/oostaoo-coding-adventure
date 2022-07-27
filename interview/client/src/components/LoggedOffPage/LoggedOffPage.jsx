import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { EndPointContext } from '../../useContext';

/* MUI components */
import Button from '@material-ui/core/Button';

/* Style */
import './loggedOffPage.css';

function LoggedOffPage() {
  const msg = useContext(EndPointContext);
  return (
    <div className="container-disconnect">
      <h3>Vous avez quitté la réunion.</h3>
      <h1>{msg}</h1>
      <div className="buttons">
        {/* <Link to="/rooms/:hash"> */}
        <Link to="/rooms/2">
          <Button variant="outlined">Retour vers l'accueil</Button>
        </Link>
      </div>
    </div>
  );
}

export default LoggedOffPage;

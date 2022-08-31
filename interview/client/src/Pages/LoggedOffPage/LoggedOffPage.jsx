import React from 'react';
import { Link } from 'react-router-dom';
/* MUI components */
import Button from '@material-ui/core/Button';

/* Style */
import './loggedOffPage.css';

function LoggedOffPage() {
  return (
    <div className="container-disconnect">
      <h3>Vous avez quitté la réunion.</h3>
      <div className="buttons">
        <Link to="/rooms/2">
          <Button variant="outlined">Retour vers l'accueil</Button>
        </Link>
      </div>
    </div>
  );
}

export default LoggedOffPage;

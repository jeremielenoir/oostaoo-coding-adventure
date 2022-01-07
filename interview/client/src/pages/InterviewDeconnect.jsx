import React from 'react'
import Button from '@material-ui/core/Button';
import './InterviewStarted.css';

function InterviewDeconnect() {
    return (
        <div className="container-disconnect">
            <h3>Vous avez quitté la réunion.</h3>
            <div className="buttons">
            <Button variant="outlined">Réintégrer la réunion</Button>
            <Button variant="contained" color="primary">Revenir à l'écran d'acceuil</Button>
            </div>
        </div>
    )
}

export default InterviewDeconnect

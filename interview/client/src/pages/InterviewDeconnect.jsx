import React from 'react'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import './InterviewStarted.css';

function InterviewDeconnect() {
    return (
        <div className="container-disconnect">
            <h3>Vous avez quitté la réunion.</h3>
            <div className="buttons">
                {/* <Link to="/rooms/:hash"> */}
                <Link to="/rooms/2">
                    <Button variant="outlined" >Réintégrer la réunion</Button>
                </Link>
            </div>
        </div>
    )
}

export default InterviewDeconnect

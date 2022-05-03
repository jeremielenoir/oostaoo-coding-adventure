import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { EndPointContext } from '../useContext';
import Button from '@material-ui/core/Button';
import '../assets/css/InterviewStarted.css';

function InterviewDeconnect() {
    const msg = useContext(EndPointContext);
    return (
        <div className="container-disconnect">
            <h3>Vous avez quitté la réunion.</h3>
            <h1>{msg}</h1>
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

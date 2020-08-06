import React from 'react'

import Button from '@material-ui/core/Button';
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';

const InterviewHome = (props) => {
    const {userVideo, confirmMeeting} = props
    return (
        <div className="main">
            <video muted className="home-video" autoPlay ref={userVideo} />
            <div className="options">
                <h1>Prêt à participer ?</h1>
                <p>Pas d'autre participant</p>
                <Button 
                    variant="contained" 
                    color='primary'
                    onClick={()=>confirmMeeting()}>
                    <p>Participer à la réunion</p>
                </Button>
                <Button variant="contained">
                    <PresentToAllIcon color='primary'/>
                    <p className="text-color">Présenter</p>
                </Button>
                <p>Autres Options</p>
                <p className="telephone">
                    <PhoneForwardedIcon />
                    participer par téléphone pour le son
                </p>
            </div>
        </div>
    )
}
export default InterviewHome;
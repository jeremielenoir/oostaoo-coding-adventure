import React from 'react'

import Button from '@material-ui/core/Button';
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';

const HomeInterview = (props) => {
    const {userVideo, confirmMeeting} = props
    return (
        <div className="main">
            <video className="video" autoPlay ref={userVideo} />
            {/*<video autoPlay ref={partnerVideo} />*/}
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
                    <PresentToAllIcon color='primary'></PresentToAllIcon>
                    <p className="text-color">Présenter</p>
                </Button>
                <p>Autres Options</p>
                <p className="telephone">
                    <PhoneForwardedIcon></PhoneForwardedIcon>
                    participer par téléphone pour le son
                </p>
            </div>
        </div>
    )
}
export default HomeInterview;
import React from 'react'

import Button from '@material-ui/core/Button';
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';

const InterviewHome = (props) => {
    const {userVideo, confirmMeeting} = props
    return (
        <div className="main">
            <div className='global-wrapper'>
                <div className='wrapper-video'>
                <video muted className="home-video" autoPlay ref={userVideo} />
                </div>
                <div className="options">
                    <p className='title'>Prêt à participer ?</p>
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
        </div>
    )
}
export default InterviewHome;
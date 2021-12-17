import React from 'react'

import Button from '@material-ui/core/Button';
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';

const InterviewHome = (props) => {
    const {userVideo, confirmMeeting} = props
    return (
        <div id="main">
            <div className='global-wrapper'>
                <div className='wrapper-video'>
                <video muted className="home-video" autoPlay ref={userVideo} />
                </div>
                <div className="options">
                    <div className='wrapper-text'>
                    <p className='title'>Prêt à participer ?</p>
                    <p>Pas d'autre participant</p>
                    <div d-flex>
                    <Button 
                        variant="contained" 
                        color='primary'
                        onClick={()=>confirmMeeting()}>
                        <p>commencer la réunion</p>
                    </Button>
                    <Button variant="outlined" color="primary" >
                        {/* <PresentToAllIcon /> */}
                        <p>Présenter</p>
                    </Button>
                    </div>
                    {/* <p>Autres Options</p> */}
                    <p className="telephone">
                        <PhoneForwardedIcon />
                        participer par téléphone pour le son
                    </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InterviewHome;
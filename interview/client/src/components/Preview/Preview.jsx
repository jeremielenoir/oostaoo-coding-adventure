import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import LogoRoodeo from '../../assets/images/logo_ROODEO.svg';
// import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';

/* Style */
import './Preview.css';

function Preview({ userVideo, confirmMeeting }) {
  return (
    <>
      <div className="nav">
        <img src={LogoRoodeo} alt="Roodeo Logo" />
      </div>
      <div id="main">
        <div className="global-wrapper">
          <div className="wrapper-video">
            <video muted className="home-video" autoPlay ref={userVideo} />
          </div>
          <div className="options">
            <div className="wrapper-text">
              <div className="container-title">
                <p className="title">Prêt à entrer dans l'arène ?</p>
                <p>
                  Actuellement,
                  <span className="users-counter"> 0 </span>
                  participant(s).
                </p>
              </div>
              <div className="container-meeting-btn">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => confirmMeeting()}
                >
                  <p>commencer la réunion</p>
                </Button>
                <Button variant="contained">
                  {/* <PresentToAllIcon /> */}
                  <p>Présenter</p>
                </Button>
              </div>
              {/* <p>Autres Options</p> */}
              {/* <p className="telephone">
              <PhoneForwardedIcon />
              participer par téléphone pour le son
            </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Preview;

Preview.propTypes = {
  userVideo: PropTypes.object,
  confirmMeeting: PropTypes.func,
};
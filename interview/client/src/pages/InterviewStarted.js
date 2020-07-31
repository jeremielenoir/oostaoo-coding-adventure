import React from 'react'

const InterviewStarted = (props) => {
    const {userVideo, partnerVideo} = props
    return (
        <div className="Interview-started">

            <div className="chat-text">

            </div>
            <div className="chat-video">
                <video className="partner-video" autoPlay ref={partnerVideo} /> 
                <video className="user-video" autoPlay ref={userVideo} />   
            </div>
        </div>
    )
}
export default InterviewStarted;

import React, { useEffect, useContext, useState } from 'react';
import socketIOClient from "socket.io-client";
import './chatRoom.css';
import { InterviewContext } from './context/InterviewContext';
import Message from './Message';
const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();
console.log('peerConnection : ', peerConnection);

export default (props) => {
    


    
    
    return (
        <div className="chatRoom">

            <div className="retour"
            onClick={()=>props.history.push('/')}>Retour
            </div>

            <div className="videoRoomOptions">

                <div className="chatTools">
                </div>

                <div className="videoChatWindow">
                    <div className="usersList">
                         <h1>Active users</h1>
                         <div className="users"></div>
                    </div>
                    <div className="mainVideo">
                        <div className="hisVideo"></div>
                        <div className="myVideo"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
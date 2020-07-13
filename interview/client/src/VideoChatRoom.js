import React, { useEffect, useContext, useRef } from 'react';
import socketIOClient from "socket.io-client";
import './videoChatRoom.css';
import { InterviewContext } from './context/InterviewContext';
import Message from './Message';

const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();


export default (props) => {
    
    const videoRef = useRef();

    const handleVideo = (stream) => {
        videoRef.current.srcObject = stream;
      }
    
    const videoError = (err) => {
        alert(err.name)
      }
    useEffect(() => {
            navigator.mediaDevices.getUserMedia({video: true, audio: true})
              .then((stream)=>{
                  handleVideo(stream);
              })
              .catch((e)=>videoError(e))       
    }, [])

    

    return (
        <div className="container">

            <header className="header">
                <div className="logo-container">
                    <h1 className="logo-text">
                         <span className="logo-highlight">roodeoo</span> vidéo
                    </h1>
                </div>
            </header>


            <div className="content-container">
                <div className="active-users-panel" id="active-user-container">
                    <h3 className="panel-title">Active Users:</h3>
                </div>


                <div className="video-chat-container">
                    <h2 className="talk-info" id="talking-with-info">
                        Select active user on the left menu.
                    </h2>
                    <div className="video-container">
                        <video autoPlay className="remote-video" id="remote-video"></video>
                        <video 
                            ref={videoRef}
                            autoPlay
                            muted 
                            className="local-video" 
                            id="local-video">
                        </video>
                    </div>
                </div>
            </div>

         </div>
    );
}
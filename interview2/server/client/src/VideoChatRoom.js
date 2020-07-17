import React, { useEffect, useContext, useState, useRef } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import './chatRoom.css';
import { InterviewContext } from './context/InterviewContext';
import Message from './Message';
import styled from "styled-components";




export default (props) => {
    
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState();
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
    
  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();


  function callPeer(id) {

    console.log('callpeer / mon id : ', yourID, ' / id a appeller : ', id)

    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {

        iceServers: [
            {
                urls: "stun:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            },
            {
                urls: "turn:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            }
        ]
    },
      stream: stream,
    });


    peer.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  
  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  const UserVideo = styled.video`
  min-width: 200px;
  min-height: 170px;
  width: 20%;
  height: 23%;
  position: absolute;
  bottom: 45px;
  right: 25px;
`;

const PartnerVideo = styled.video`
  width: 100%;
  height: 100%;
`;
  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div className='incomingCall'>
        <h3>{caller} is calling you</h3>
        <button onClick={acceptCall}>Accept</button>
      </div>
    )
  }

  useEffect(() => {
    socket.current = io.connect("/");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (users) => {
      
      setUsers(users);
      console.log('users : ', users);
    })

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, []);
  
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
                         <div className="users">
                             <ul>
                                 {users && Object.keys(users).map(
                                     key => {
                                         if (key === yourID){
                                             return null;
                                         }
                                         return <li key={key}>
                                             <button
                                             onClick={()=>callPeer(key)}>Call {key}</button>
                                         </li>
                                     }
                                 )}
                             </ul>
                         </div>
                    </div>
                    <div className="mainVideo">
                       {
                       callAccepted && <PartnerVideo 
                            ref={partnerVideo}
                            className="partnerVideo"
                            autoPlay
                            playsInline
                            muted
                             />
                       }
                            {!callAccepted ? incomingCall : null}
                             
                         <UserVideo
                          playsInline 
                          ref={userVideo} 
                          muted
                          autoPlay />
                    </div>
                </div>
            </div>
        </div>
    );
}
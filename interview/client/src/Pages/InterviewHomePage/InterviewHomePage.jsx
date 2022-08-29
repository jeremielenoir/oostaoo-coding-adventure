import React, {  useRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
// import { decryptHash } from '../services/decryptService';
import Preview from '../../components/Preview/Preview';
import Interview from '../../components/Interview/Interview';
// import socket from 'socket.io-client/lib/socket';

// socket variables
import dico from '../../common/dico';

const {
  SOCKET_ANSWER,
  SOCKET_CONNECT,
  SOCKET_ICE_CANDIDATE,
  SOCKET_JOIN_ROOM,
  SOCKET_OFFER,
  SOCKET_USER_JOINED,
  SOCKET_OTHER_USER,
  // SOCKET_FROMAPI,
} = dico;

function InterviewHomePage({ match }) {
  const hash = match.params.hash;

  const [meetingConfirmation, setMeetingConfirmation] = useState(true);
  // const [nom, setNom] = useState('');
  // const [email] = useState('');
  // const [interviewId, setInterviewId] = useState('');
  // const [date, setDate] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const userVideo = useRef(); // Obligatoire
  const partnerVideo = useRef(); // Obligatoire
  const peerRef = useRef(); // Obligatoire
  const socketRef = io(process.env.REACT_APP_SOCKET_SERVER);
  const otherUser = useRef();
  const userStream = useRef();

  const createPeer = useCallback((userID) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: process.env.REACT_APP_ICE_URL_ONE },
        {
          urls: process.env.REACT_APP_ICE_URL_TWO,
          credential: process.env.REACT_APP_ICE_CREDENTIAL,
          username: process.env.REACT_APP_ICE_USERNAME,
        },
      ],
    });

    function handleICECandidateEvent(e) {
      if (e.candidate) {
        const payload = {
          target: otherUser.current,
          candidate: e.candidate,
        };
        socketRef.emit(SOCKET_ICE_CANDIDATE, payload);
      }
    }
    function handleNegotiationNeededEvent(userID) {
      peerRef.current
        .createOffer()
        .then((offer) => peerRef.current.setLocalDescription(offer))
        .then(() => {
          const payload = {
            target: userID,
            caller: socketRef.id,
            sdp: peerRef.current.localDescription,
          };
          socketRef.emit(SOCKET_OFFER, payload);
        })
        .catch((e) => console.error(e));
    }
    
    peer.onicecandidate = handleICECandidateEvent;
    // peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  }, [socketRef]);

  const callUser = useCallback(
    (userID) => {
      peerRef.current = createPeer(userID);
      userStream.current
        .getTracks()
        // eslint-disable-next-line
        .forEach(
          (track) => peerRef.current.addTrack(track, userStream.current)
          // eslint-disable-next-line
        );
    },
    [createPeer]
  );

  const handleReceiveCall = useCallback(
    (incoming) => {
      peerRef.current = createPeer();
      const desc = new RTCSessionDescription(incoming.sdp);
      peerRef.current
        .setRemoteDescription(desc)
        .then(() => {
          userStream.current.getTracks().forEach(
            (track) => peerRef.current.addTrack(track, userStream.current)
            // eslint-disable-next-line
          );
        })
        .then(() => peerRef.current.createAnswer())
        .then((answer) => peerRef.current.setLocalDescription(answer))
        .then(() => {
          const payload = {
            target: incoming.caller,
            caller: socketRef.id,
            sdp: peerRef.current.localDescription,
          };
          socketRef.emit(SOCKET_ANSWER, payload);
        });
    },
    [createPeer, socketRef]
  );

  
  
  function handleAnswer(message) {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch((e) => console.error(e));
  }

  function handleNewICECandidateMsg(incoming) {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current.addIceCandidate(candidate).catch((e) => console.error(e));
  }



  // function handleTrackEvent(e) {
  //   if (partnerVideo) {
  //     // This is a quick fix to prevent bug during the loading homepage partner
  //     // ( might need further investigation )
  //     partnerVideo.current.srcObject = e.streams[0];
  //   }
  // }


  useEffect(() => {
    //   decryptHash(props.match.params.hash).then((res) => {
    //     setInterviewId(res.interview_id);
    //     setEmail(res.email);
    //     setDate(res.interview_date);
    //     console.log('res : ', res);
    //     console.log('date : ', date);
    //     if(res.nom){setNom(res.nom)};
    //   });
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        userStream.current = stream;
       
        socketRef.on(SOCKET_OTHER_USER, (userID) => {
          callUser(userID);
          otherUser.current = userID;
        });

        socketRef.on(SOCKET_USER_JOINED, (userID) => {
          otherUser.current = userID;
        });
      });
      
      socketRef.on(SOCKET_CONNECT, () => {
        console.warn(socketRef.connected); // true
      });

      socketRef.emit(SOCKET_JOIN_ROOM, Number(hash));

      socketRef.on(SOCKET_OFFER, handleReceiveCall);

      socketRef.on(SOCKET_ANSWER, handleAnswer);

      socketRef.on(SOCKET_ICE_CANDIDATE, handleNewICECandidateMsg);
  }, [callUser, handleReceiveCall, meetingConfirmation, hash, socketRef]);

  function micToggle() {
    // console.log('userstream.current : ', userStream.current);
    // eslint-disable-next-line
    userStream.current.getAudioTracks()[0].enabled =
      !userStream.current.getAudioTracks()[0].enabled;
    setMicOn(!micOn);
  }

  function confirmMeeting() {
    setMeetingConfirmation(!meetingConfirmation);
  }

  return (
    <div className="home-interview">
      {meetingConfirmation ? (
        <Preview userVideo={userVideo} confirmMeeting={confirmMeeting} />
      ) : (
        <Interview
          userVideo={userVideo}
          partnerVideo={partnerVideo}
          micToggle={micToggle}
          micOn={micOn}
          setMicOn={setMicOn}
        />
      )}
    </div>
  );
}

InterviewHomePage.propTypes = { match: PropTypes.object };

export default InterviewHomePage;

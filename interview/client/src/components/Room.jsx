import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

import LogoRoodeo from '../assets/logo_ROODEO.svg';
// import { decryptHash } from '../services/decryptService';

import InterviewHome from '../pages/InterviewHome';
import InterviewStarted from '../pages/InterviewStarted';

function Room(props) {
  const [meetingConfirmation, setMeetingConfirmation] = useState(true);
  // const [nom, setNom] = useState('');
  const [email] = useState('');
  // const [interviewId, setInterviewId] = useState('');
  // const [date, setDate] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();

  function callUser(userID) {
    peerRef.current = createPeer(userID);
    userStream.current
      .getTracks()
      .forEach((track) => peerRef.current.addTrack(track, userStream.current));
  }

  function handleRecieveCall(incoming) {
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach((track) => peerRef.current.addTrack(track, userStream.current),
          );
      })
      .then(() => peerRef.current.createAnswer())
      .then((answer) => peerRef.current.setLocalDescription(answer))
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit('answer', payload);
      });
  }

  function handleAnswer(message) {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
  }

  function handleNewICECandidateMsg(incoming) {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  }

  function createPeer(userID) {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.stunprotocol.org' },
        {
          urls: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com',
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  }

  function handleICECandidateEvent(e) {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socketRef.current.emit('ice-candidate', payload);
    }
  }

  function handleTrackEvent(e) {
    if (partnerVideo) {
      // This is a quick fix to prevent bug during the loading homepage partner
      // ( might need further investigation )
      partnerVideo.current.srcObject = e.streams[0];
    }
  }

  function handleNegotiationNeededEvent(userID) {
    peerRef.current
      .createOffer()
      .then((offer) => peerRef.current.setLocalDescription(offer))
      .then(() => {
        const payload = {
          target: userID,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit('offer', payload);
      })
      .catch((e) => console.log(e));
  }

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
        console.log('stream', stream, 'userVideo', userVideo);

        userVideo.current.srcObject = stream;
        userStream.current = stream;

        socketRef.current = io.connect('/');
        socketRef.current.emit('join room', props.match.params.roomID);

        socketRef.current.on('other user', (userID) => {
          callUser(userID);
          otherUser.current = userID;
        });

        socketRef.current.on('user joined', (userID) => {
          otherUser.current = userID;
        });

        socketRef.current.on('offer', handleRecieveCall);

        socketRef.current.on('answer', handleAnswer);

        socketRef.current.on('ice-candidate', handleNewICECandidateMsg);
      });
  }, [meetingConfirmation]);

  function micToggle() {
    console.log('userstream.current : ', userStream.current);
    userStream.current.getAudioTracks()[0].enabled =      !userStream.current.getAudioTracks()[0].enabled;
    setMicOn(!micOn);
  }

  function confirmMeeting() {
    setMeetingConfirmation(!meetingConfirmation);
  }

  return (
    <div className="home-interview">
      <div className="nav">
        <img src={LogoRoodeo} alt="React Logo" />
        <div className="email">{email}</div>
      </div>
      {meetingConfirmation ? (
        <InterviewHome userVideo={userVideo} confirmMeeting={confirmMeeting} />
      ) : (
        <InterviewStarted
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

Room.propTypes = { match: PropTypes.object };

export default Room;

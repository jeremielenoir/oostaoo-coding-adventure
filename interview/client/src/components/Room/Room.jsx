import React, { useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
// import { decryptHash } from '../services/decryptService';
import HomePage from '../HomePage/HomePage';
import Interview from '../Interview/Interview';

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
} = dico;

function Room(props) {
  console.log(props);
  const hash = props.match.params.hash;

  const [meetingConfirmation, setMeetingConfirmation] = useState(true);
  // const [nom, setNom] = useState('');
  // const [email] = useState('');
  // const [interviewId, setInterviewId] = useState('');
  // const [date, setDate] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();

  const createPeer = useCallback((userID) => {
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
  }, []);

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
            caller: socketRef.current.id,
            sdp: peerRef.current.localDescription,
          };
          socketRef.current.emit(SOCKET_ANSWER, payload);
        });
    },
    [createPeer]
  );

  function handleAnswer(message) {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
  }

  function handleNewICECandidateMsg(incoming) {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  }

  function handleICECandidateEvent(e) {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socketRef.current.emit(SOCKET_ICE_CANDIDATE, payload);
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
        socketRef.current.emit(SOCKET_OFFER, payload);
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
        console.log('SOCKET SERVER', process.env.REACT_APP_SOCKET_SERVER);
        socketRef.current = io(process.env.REACT_APP_SOCKET_SERVER);

        socketRef.current.on(SOCKET_CONNECT, () => {
          console.log(socketRef.current.connected); // true
        });

        socketRef.current.emit(SOCKET_JOIN_ROOM, Number(hash));

        socketRef.current.on(SOCKET_OTHER_USER, (userID) => {
          callUser(userID);
          otherUser.current = userID;
        });

        socketRef.current.on(SOCKET_USER_JOINED, (userID) => {
          otherUser.current = userID;
        });

        socketRef.current.on(SOCKET_OFFER, handleReceiveCall);

        socketRef.current.on(SOCKET_ANSWER, handleAnswer);

        socketRef.current.on(SOCKET_ICE_CANDIDATE, handleNewICECandidateMsg);
      });
  }, [callUser, handleReceiveCall, meetingConfirmation, hash]);

  function micToggle() {
    console.log('userstream.current : ', userStream.current);
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
        <HomePage userVideo={userVideo} confirmMeeting={confirmMeeting} />
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

Room.propTypes = { match: PropTypes.object };

export default Room;

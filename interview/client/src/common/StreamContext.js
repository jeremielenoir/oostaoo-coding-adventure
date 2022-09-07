import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import Peer from 'simple-peer';

// socket variables
import dico from './dico';

const socket = io.connect(process.env.REACT_APP_SOCKET_SERVER);

const {
  SOCKET_JOIN_ROOM,
  SOCKET_MY_ID,
  SOCKET_SEND_CALL,
  SOCKET_RECEIVE_CALL,
  SOCKET_CALL_RECEIVED,
  SOCKET_OTHER_USER,
} = dico;

export const StreamContext = createContext();

export const StreamContextProvider = ({ children }) => {
  const [mySocketID, setMySocketID] = useState('');
  const [partnerSocketID, setPartnerSocketID] = useState('');
  const [myStream, setMyStream] = useState(null);
  const [callerSignal, setCallerSignal] = useState();

  const [pageHash, setPageHash] = useState('');
  const [meetingConfirmation, setMeetingConfirmation] = useState(true);

  const myVideo = useRef();
  const partnerVideo = useRef();
  const connectionRef = useRef();

  const callUser = useCallback(
    (id) => {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: myStream,
      });

      peer.on('signal', (data) => {
        socket.emit(SOCKET_SEND_CALL, {
          userToCall: id,
          signalData: data,
          from: mySocketID,
        });
      });

      peer.on('stream', (stream) => {
        partnerVideo.current.srcObject = stream;
      });

      socket.on(SOCKET_CALL_RECEIVED, (signal) => {
        peer.signal(signal);
      });

      connectionRef.current = peer;
    },
    [mySocketID, myStream]
  );

  const receiveCall = useCallback(
    (partnerID) => {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: myStream,
      });

      peer.on('signal', (data) => {
        socket.emit(SOCKET_RECEIVE_CALL, { signal: data, to: partnerID });
      });

      peer.on('stream', (stream) => {
        partnerVideo.current.srcObject = stream;
      });

      if (callerSignal) {
        peer.signal(callerSignal);
      }

      connectionRef.current = peer;
    },
    [callerSignal, myStream]
  );

  // // keep for later so we can cut the video stream when leaving the room (issue #480)
  // const leaveCall = () => {
  //   connectionRef.current.destroy();
  // };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        myVideo.current.srcObject = stream;
        setMyStream(stream);
      });

    socket.on(SOCKET_MY_ID, (id) => {
      setMySocketID(id);
    });

    socket.emit(SOCKET_JOIN_ROOM, Number(pageHash));
  }, [meetingConfirmation, pageHash]);

  useEffect(() => {
    socket.on(SOCKET_SEND_CALL, (data) => {
      // setPartnerSocketID(data.from);
      setCallerSignal(data.signal);
    });

    socket.on(SOCKET_OTHER_USER, (partnerID) => {
      setPartnerSocketID(partnerID);
      callUser(partnerID);
      receiveCall(partnerID);
    });
    // eslint-disable-next-line
  }, [meetingConfirmation]); // need investigation, React asks for callUser + receiveCall dependencies but it breaks the app

  function confirmMeeting() {
    setMeetingConfirmation(!meetingConfirmation);
  }

  return (
    <StreamContext.Provider
      value={{
        myVideo,
        partnerSocketID,
        partnerVideo,
        setPageHash,
        meetingConfirmation,
        confirmMeeting,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

StreamContextProvider.propTypes = { children: PropTypes.object };

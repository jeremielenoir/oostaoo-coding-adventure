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
  const [micOn, setMicOn] = useState(false);
  const [mySocketID, setMySocketID] = useState('');
  const [partnerSocketID, setPartnerSocketID] = useState('');
  const [myStream, setMyStream] = useState(null);
  const [callerSignal, setCallerSignal] = useState();
  const [videoCamOn, setVideoCamOn] = useState(false);

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

  const leaveCall = useCallback(() => {
    socket.emit('leave-call', { userID: mySocketID, room: pageHash });
    connectionRef.current.streams[0].getAudioTracks()[0].enabled = false;
    connectionRef.current.streams[0].getVideoTracks()[0].enabled = false;
  }, [mySocketID, pageHash]);

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

    if (pageHash) {
      socket.emit(SOCKET_JOIN_ROOM, pageHash);
    }
  }, [meetingConfirmation, pageHash]);

  // Leaving room logic if user simply directly close the tab
  useEffect(() => {
    const handleTabClose = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleTabClose);
    window.addEventListener('unload', leaveCall);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      window.removeEventListener('unload', leaveCall);
    };
  }, [leaveCall]);

  useEffect(() => {
    socket.on(SOCKET_SEND_CALL, (data) => {
      setCallerSignal(data.signal);
    });

    socket.on(SOCKET_OTHER_USER, (partnerID) => {
      setPartnerSocketID(partnerID);

      if (!meetingConfirmation) {
        callUser(partnerID);
        receiveCall(partnerID);
      }
    });
    // eslint-disable-next-line
  }, [meetingConfirmation]);
  // need investigation, React asks for callUser + receiveCall dependencies but it breaks the app

  function confirmMeeting() {
    setMeetingConfirmation(!meetingConfirmation);
  }

  function micToggle() {
    connectionRef.current.streams[0].getAudioTracks()[0].enabled =
      !connectionRef.current.streams[0].getAudioTracks()[0].enabled;
    setMicOn(!micOn);
  }

  function videoCamToggle() {
    connectionRef.current.streams[0].getVideoTracks()[0].enabled =
      !connectionRef.current.streams[0].getVideoTracks()[0].enabled;
    setVideoCamOn(!videoCamOn);
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
        micToggle,
        micOn,
        leaveCall,
        videoCamOn,
        videoCamToggle,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

StreamContextProvider.propTypes = { children: PropTypes.object };

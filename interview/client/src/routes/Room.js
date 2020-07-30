import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import Button from '@material-ui/core/Button';
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import LogoRoodeo from '../assets/logo_ROODEO.svg';
import { decryptHash } from '../services/decryptService';

const Room = (props) => {

    const [ meetingConfirmation, setMeetingConfirmation ] = useState(false);
    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();
    const  [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [interviewId, setInterviewId] = useState('');

    useEffect(() => {
    
        decryptHash(props.match.params.hash)
        .then((res)=>{
            console.log('res email : ', res.email);
            setInterviewId(res.interview_id);
            setEmail(res.email);
            if(res.nom){setNom(res.nom)};
            });

        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {

            userVideo.current.srcObject = stream;
            userStream.current = stream;

            socketRef.current = io.connect("/");
            socketRef.current.emit("join room", props.match.params.roomID);

            socketRef.current.on('other user', userID => {
                callUser(userID);
                otherUser.current = userID;
            });

            socketRef.current.on("user joined", userID => {
                otherUser.current = userID;
            });

            socketRef.current.on("offer", handleRecieveCall);

            socketRef.current.on("answer", handleAnswer);

            socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
        });

    }, []);

    function callUser(userID) {
        peerRef.current = createPeer(userID);
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    }

    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    }

    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleRecieveCall(incoming) {
        peerRef.current = createPeer();
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    function handleTrackEvent(e) {
        partnerVideo.current.srcObject = e.streams[0];
    };

    function confirmMeeting(){
        setMeetingConfirmation(true);
    }

    return (
        <div className="home-interview">
            <div className="nav">
                <img src={LogoRoodeo} alt="React Logo" />
                <div className="email">{ email }</div>
            </div>

            { meetingConfirmation ? 
            
            <div className="main">
                <video className="video" autoPlay ref={userVideo} />
                {/*<video autoPlay ref={partnerVideo} />*/}
                <div className="options">
                    <h1>Prêt à participer ?</h1>
                    <p>Pas d'autre participant</p>
                    <Button 
                     variant="contained" 
                     color='primary'
                     onClick={()=>console.log('yé')}>
                        <p>Déconnecter</p>
                    </Button>
                    <p>Autres Options</p>
                    <p className="telephone">
                        <PhoneForwardedIcon></PhoneForwardedIcon>
                        participer par téléphone pour le son
                    </p>
                </div>
            </div>

                :
            
                <div className="main">
                <video className="video" autoPlay ref={userVideo} />
                {/*<video autoPlay ref={partnerVideo} />*/}
                <div className="options">
                    <h1>Prêt à participer ?</h1>
                    <p>Pas d'autre participant</p>
                    <Button 
                     variant="contained" 
                     color='primary'
                     onClick={()=>setMeetingConfirmation(true)}>
                        <p>Participer à la réunion</p>
                    </Button>
                    <Button variant="contained">
                        <PresentToAllIcon color='primary'></PresentToAllIcon>
                        <p className="text-color">Présenter</p>
                    </Button>
                    <p>Autres Options</p>
                    <p className="telephone">
                        <PhoneForwardedIcon></PhoneForwardedIcon>
                        participer par téléphone pour le son
                    </p>
                </div>
            </div>

              }
        </div>
    )
};

export default Room;
import React, {useState, useEffect, useRef} from 'react';
import socketIOClient from "socket.io-client";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MicOffIcon from '@material-ui/icons/MicOff';
import MicIcon from '@material-ui/icons/Mic';
import './InterviewStarted.css';
import Message from './Message';



const InterviewStarted = ({userVideo, partnerVideo, micToggle, micOn }) => {

    const inputRef = useRef();
    const [message, setMessage] = useState("");

    const [ messages, setMessages ] = useState({response: false,
        endpoint: "http://localhost:8000"}); //Ngrok adress

    const {endpoint} = messages;
    const socket = socketIOClient(endpoint);
   
    useEffect(()=>{
        inputRef.current.focus();
        socket.on("FromAPI", data => setMessages({response: data}));
        }, [socket]);

    const onChangeMessage = (e)=>{
        setMessage(e.target.value);
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if(message){
          socket.emit('newMessage', message);
          setMessage("");
        }
      }

    return (
        <div className="interview-started">

            <div className="chat-text">
               
                <div className="messagesList">
                          {
                            messages.response.length > 0 ? 
                            messages.response.map(message=>
                            <Message text={message.text} date={message.date}/>)
                             : ""
                          }
                      </div>
                

                <div className="messageWriting">
                      <form className="messageForm"
                        onSubmit={e=>sendMessage(e)}>
                          <TextField
                            required
                            id="message"
                            label="Message"
                            value={message}
                            ref={inputRef}
                            onChange={(e)=>onChangeMessage(e)}
                            variant="outlined"
                          />
                          <Button 
                            variant="contained" 
                            color="primary"
                            onClick={e=>sendMessage(e)}>
                            Envoyer
                          </Button>
                      </form>
                </div>
            </div>

            <div className="chat-video">
                <div className="partner-video">
                    <video controls  autoPlay ref={partnerVideo} />
                    { micOn ? <MicOffIcon className="mic" color="primary" onClick={()=>micToggle()} />
                    : <MicIcon className="mic" color="primary" 
                     onClick={()=>micToggle()} /> }
                </div> 
                
                <div className="user-video" >
                    <video muted autoPlay ref={userVideo} />
                </div>   
                 
            </div>
        </div>
    )
}
export default InterviewStarted;

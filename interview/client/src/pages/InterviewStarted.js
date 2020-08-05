import React, {useState, useEffect, useRef} from 'react';
import socketIOClient from "socket.io-client";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MicOffIcon from '@material-ui/icons/MicOff';


import './InterviewStarted.css';
import Message from './Message';



const InterviewStarted = (props) => {
    const {userVideo, partnerVideo} = props;
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
                      <form className="messageForm">
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
                <video controls className="partner-video" autoPlay ref={partnerVideo} /> 
                <video muted controls className="user-video" autoPlay ref={userVideo} />   
                <MicOffIcon/>
            </div>
        </div>
    )
}
export default InterviewStarted;

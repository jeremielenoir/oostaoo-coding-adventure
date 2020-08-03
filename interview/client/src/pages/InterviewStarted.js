import React, {useState, useEffect, useRef} from 'react';
import socketIOClient from "socket.io-client";

import './InterviewStarted.css';
import Message from './Message';



const InterviewStarted = (props) => {
    const {userVideo, partnerVideo} = props;
    const inputRef = useRef();
    
    const [message, setMessage] = useState("");


    const [ messages, setMessages ] = useState({response: false,
        endpoint: "http://localhost:8000"});

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
        <div className="Interview-started">

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
                        <input 
                          type="text"
                          id="message"
                          size="50"
                          value={message}
                          ref={inputRef}
                          onChange={(e)=>onChangeMessage(e)} />
                        <button onClick={e=>sendMessage(e)}>Envoyer</button>
                      </form>
                </div>



            </div>

            <div className="chat-video">
                <video className="partner-video" autoPlay ref={partnerVideo} /> 
                <video className="user-video" autoPlay ref={userVideo} />   
            </div>
        </div>
    )
}
export default InterviewStarted;

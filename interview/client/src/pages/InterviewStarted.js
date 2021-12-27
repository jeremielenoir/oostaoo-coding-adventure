import React, {useState, useEffect, useRef} from 'react';
import socketIOClient from "socket.io-client";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MicOffIcon from '@material-ui/icons/MicOff';
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import GroupIcon from '@material-ui/icons/Group';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import CloseIcon from '@material-ui/icons/Close';
import CallEndIcon from '@material-ui/icons/CallEnd';
import './InterviewStarted.css';
import Message from './Message';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const InterviewStarted = ({userVideo, partnerVideo, micToggle, micOn, groupToggle, chatToggle }) => {

  const [secondary] = React.useState(false);
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
        <div className="container-video-chat">
        <div className="chat-video">
          <div className="partner-video">
            <video controls autoPlay ref={partnerVideo} />
          </div>

          <div className="user-video">
            <video muted autoPlay ref={userVideo} />
          </div>
        </div>

        <div className="chat-text">
        <div className="title-chat-text">
          <span> Messages dans l'appel </span>
            <CloseIcon id="close-icon"/>
          </div>
          <div className="messagesList">
            {/* {
                            messages.response.length > 0 ? 
                            messages.response.map(message=>
                            <Message text={message.text} date={message.date}/>)
                             : ""
                          } */}
            {messages.response.length > 0 &&
              messages.response.map((message) => (
                <Message text={message.text} date={message.date} />
              ))}
          </div>

          <div className="messageWriting">
            <form className="messageForm" onSubmit={(e) => sendMessage(e)}>
              <TextField
                required
                id="message"
                label="Message"
                value={message}
                ref={inputRef}
                onChange={(e) => onChangeMessage(e)}
                variant="outlined"
              />
              <Button id="send" size="small" color="primary" onClick={(e) => sendMessage(e)} style={{maxWidth: '40px', maxHeight: '56px', minWidth: '40px', minHeight: '56px', marginLeft: '5px', }}>
                <SendIcon/>
              </Button>
            </form>
          </div>
        </div>

        <div className="users-room">
          <div className="title-users-room">
          <span> Participants </span>
            <CloseIcon id="close-icon"/>
          </div>
            <div className="search-users"></div>
            <div className="users-list">
            <List>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            U {/* Username */}
          </Avatar>
        </ListItemAvatar>
        <ListItemText className="list-item-text" primary="UserName" secondary={secondary ? 'Secondary text' : null}/>
      </ListItem>
    </List>
            </div>
        </div>
        </div>
        <footer className="container-interview-footer">
          <div className="icons">

          <div id="icon-mic">
          {micOn ? (
              <MicOffIcon
                className="mic"
                color="primary"
                onClick={() => micToggle()}
              />
            ) : (
              <MicIcon
                className="mic"
                color="primary"
                onClick={() => micToggle()}
              />
            )}
        </div>
              <div> <CallEndIcon color="secondary"/> </div>
          </div>
      

      <div className="footer-left-button">
        <GroupIcon className="footer-icons" onClick={() => groupToggle()}/>
        <QuestionAnswerIcon className="footer-icons" onClick={() => chatToggle()}/>
        </div>
        </footer>  
      </div>
    );
}
export default InterviewStarted;

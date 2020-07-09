import React, { useEffect, useContext, useState, useRef } from 'react';
import socketIOClient from "socket.io-client";
import './chatRoom.css';
import { InterviewContext } from './context/InterviewContext';
import Message from './Message';

export default (props) => {
    const inputRef = useRef(null);
    const [message, setMessage] = useState("");
    const { selectedCandidates } = useContext(InterviewContext);
    const [ candidateDisconnected, setCandidateDisconnected ] = useState(false);
    const [ messages, setMessages ] = useState({response: false,
      endpoint: "http://localhost:4000"});

      const {endpoint} = messages;
      const socket = socketIOClient(endpoint);
      

      socket.on("candidateDisconnected", ()=>{
        setCandidateDisconnected(true);
        setTimeout(()=>{
          setCandidateDisconnected(false);
        }, 1000)
      })

      useEffect(()=>{
        socket.on("FromAPI", data => setMessages({response: data}));
      }, [])

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

      useEffect(()=>{
        inputRef.current.focus();
      }, []);
    
    const candidate = selectedCandidates[0];
    console.log('candidate : ', candidate);
    return (
        <div className="chatRoom">

            <div className="retour"
            onClick={()=>props.history.push('/')}>Retour
            </div>
            <h1>{`Interview - ${candidate.prenom} ${candidate.nom}`}</h1>

            <div className="chatRoomOptions">

                <div className="chatTools">

                  <a className="option" href={`https://talky.io/roodeoo.com&candidate=${candidate.id}`} target="_blank">
                    Chat Vidéo
                  </a>

                    <div className="option">Living Code</div>
                </div>

                <div className="chatWindow">

                { candidateDisconnected && <p>Un utilisateur a quitté le chat</p> }

                   <div className="saisieMessage">
                      <form className="messageForm">
                        <label>Ecrire votre message : </label>
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

                 
                    <div className="chatContainer">
                      <div className="messagesDiv">
                          {
                            messages.response.length > 0 ? 
                            messages.response.map(message=>
                            <Message text={message.text} date={message.date}/>)
                             : ""
                          }
                      </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
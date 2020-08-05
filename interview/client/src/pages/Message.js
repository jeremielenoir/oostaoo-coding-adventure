import React from 'react';
import './InterviewStarted.css';

import './Message.css'

export default ({text, date}) => {
  return <div className="message">
           <div className="messageText">{text}</div>
           <div className="messageDate">{date}</div>
         </div>
}


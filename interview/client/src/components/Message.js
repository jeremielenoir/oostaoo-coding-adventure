import React from 'react';
import '../assets/css/InterviewStarted.css';

import '../assets/css/Message.css'

export default ({text, date}) => {
  return <div className="message">
           <div className="messageText">{text}</div>
           <div className="messageDate">{date}</div>
         </div>
}


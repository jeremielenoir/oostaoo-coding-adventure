import React from 'react';
import '../assets/css/InterviewStarted.css';

import '../assets/css/Message.css';

export default function Messages({ text, date }) {
  const x = 'coucou';
  console.log('test');
  return (
    <div className="message">
      <div className="messageText">{text}</div>
      <div className="messageDate">{date}</div>
    </div>
  );
}

import React from 'react';
import './chatRoom.css';

export default ({text, date}) => 
<div className="message">
   {text}
    <span className="messageDate">{date}</span>
</div>
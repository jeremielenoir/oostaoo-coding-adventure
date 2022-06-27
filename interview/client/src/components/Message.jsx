import React from 'react';
import PropTypes from 'prop-types';

import '../assets/css/Interview.css';
import '../assets/css/Message.css';

export default function Messages({ text, date }) {
  return (
    <div className="message">
      <div className="messageText">{text}</div>
      <div className="messageDate">{date}</div>
    </div>
  );
}

Messages.propTypes = {
  text: PropTypes.string,
  date: PropTypes.string,
};

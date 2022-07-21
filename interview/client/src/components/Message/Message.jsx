import React from 'react';
import PropTypes from 'prop-types';

/* Style */
import './message.css';

export default function Message({ text, date }) {
  return (
    <div className="message">
      <div className="messageText">{text}</div>
      <div className="messageDate">{date}</div>
    </div>
  );
}

Message.propTypes = {
  text: PropTypes.string,
  date: PropTypes.string,
};

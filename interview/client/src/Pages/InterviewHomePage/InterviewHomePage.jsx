import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { StreamContext } from '../../common/StreamContext';
import Preview from '../../components/Preview/Preview';
import Interview from '../../components/Interview/Interview';

function InterviewHomePage({ match }) {
  const { setPageHash, meetingConfirmation } = useContext(StreamContext);
  const hash = match.params.hash; // room ID

  useEffect(() => {
    setPageHash(hash);
  }, [hash, setPageHash]);

  return (
    <div className="home-interview">
      {meetingConfirmation ? (
        <Preview />
      ) : (
        <Interview />
      )}
    </div>
  );
}

InterviewHomePage.propTypes = { match: PropTypes.object };

export default InterviewHomePage;
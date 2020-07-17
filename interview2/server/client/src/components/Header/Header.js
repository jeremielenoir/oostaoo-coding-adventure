import React, { useState } from "react";
import "./Header.css";
import CandidatesList from './CandidatesList';

const Header = () => {

  const [candidatesToInterview, setCandidatesToInterview] = useState([]);
  const addCandidatesToInterview = (candidates)=>{
    setCandidatesToInterview([...candidatesToInterview, ...candidates]);
  }
 
  return (
    <div className="header-container">
      <h3 className="header-h3">
        ENTRETIEN TECHNIQUE À DISTANCE
      </h3>
      <p>
        Faites connaissance avec vos candidats et utilisez notre éditeur de code
        partagé pour comprendre leur manière de réfléchir et de résoudre les
        problèmes.
      </p>
      <div id="candidatesContainer">
        <div id="candidates">
        
        </div>
        <div id="candidatesInvited">
        </div>

      </div>
   
    </div>
  );
};

export default Header;

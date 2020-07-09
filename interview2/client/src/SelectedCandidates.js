import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import "./SelectedCandidates.css";
import {InterviewContext} from './context/InterviewContext';
import Candidat from './Candidat';

export default({redirect}) => {
  


  const { userCandidates, selectCandidate, unselectCandidate, selectedCandidates } = useContext(InterviewContext);
  
  const goToChatRoom = () => {
    if(selectedCandidates.length > 0){
    redirect(`/chatroom/${selectedCandidates[0].id}`);
    }
    return;
  }

  const putInSelectedCandidates = (id) => {
    const candidateToSelect = userCandidates.find(cand=>cand.id == id);
    selectCandidate(candidateToSelect);
  }

  return (
    <div className="selectedCandidates">
      <div className="form-button"
      onClick={()=>{goToChatRoom()}}
      >LANCER L'INTERVIEW</div>
        {userCandidates && userCandidates.map(c=>
        <Candidat 
           key={c.id} 
           id={c.id} 
           selectCandidate={putInSelectedCandidates} 
           unselectCandidate={unselectCandidate}
           selectedCandidates={selectedCandidates}
           prenom={c.prenom} nom={c.nom} 
           email={c.email} />)
        }  
    </div>
  );
};


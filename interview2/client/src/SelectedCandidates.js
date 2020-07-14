import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import "./SelectedCandidates.css";
import {InterviewContext} from './context/InterviewContext';
import Candidat from './Candidat';

export default({redirect}) => {
  


  const { firmCandidates, selectCandidate, selectedCandidates } = useContext(InterviewContext);
  
  const goToChatRoom = () => {
    if(selectedCandidates.length > 0){
    redirect(`/chatroom/${selectedCandidates[0].id}`);
    }
    return;
  }

  const putInSelectedCandidates = (id) => {
    const candidateToSelect = firmCandidates.find(cand=>cand.id == id);
    selectCandidate(candidateToSelect);
  }

  return (
    <div className="selectedCandidates">
      <div className="form-button"
      onClick={()=>{goToChatRoom()}}
      >LANCER L'INTERVIEW</div>
        {firmCandidates && firmCandidates.map(c=>
        <Candidat 
           key={c.id} 
           id={c.id} 
           selectCandidate={putInSelectedCandidates} 
           selectedCandidates={selectedCandidates}
           prenom={c.prenom} nom={c.nom} 
           email={c.email} />)
        }  
    </div>
  );
};


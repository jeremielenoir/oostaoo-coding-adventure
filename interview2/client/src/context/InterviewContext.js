import React, {useState, useEffect} from 'react';
import Interview from '../Interview';
import SelectedCandidates from '../SelectedCandidates';

export const InterviewContext = React.createContext();

const InterviewContextProvider = ({children})=> {

  const [firmCandidates, setFirmCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  useEffect(()=>{
    const fetchFirmCandidates = async () => {
      const response = await fetch ('/candidates/4');
      const firmCandidates = await response.json();
       setFirmCandidates(firmCandidates);
       return;
    }
    fetchFirmCandidates(); 
  }, [])
  
  const name = 'Maximus';

  const selectCandidate = (candidat) => {
    if (!selectedCandidates.some(c=>c.id == candidat.id)){
      setSelectedCandidates([...selectedCandidates, candidat]);
    }else{
      const newSelectedCandidates = selectedCandidates.filter(c=>c.id !== candidat.id);
      setSelectedCandidates(newSelectedCandidates);
    }
    return;
  };


  const value = { name, firmCandidates, selectedCandidates, selectCandidate }
        return (
            <InterviewContext.Provider value={value}>
              {children }
            </InterviewContext.Provider>
        )
    
}


export default InterviewContextProvider;

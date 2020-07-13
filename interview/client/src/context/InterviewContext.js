import React, {useState, useEffect} from 'react';
import Interview from '../Interview';
import SelectedCandidates from '../SelectedCandidates';

export const InterviewContext = React.createContext();

const InterviewContextProvider = ({children})=> {

  const [userCandidates, setUserCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  useEffect(()=>{
    const fetchUserCandidates = async () => {
      const response = await fetch ('/candidates/4');
      const userCandidates = await response.json();

       setUserCandidates(userCandidates);
       console.log('this.state.userCandidates : ', userCandidates);
       return;
       
    }
    fetchUserCandidates(); 
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

  const unselectCandidate = (id) => {
    
  }

  const value = { name, userCandidates, selectedCandidates, selectCandidate, unselectCandidate }
        return (
            <InterviewContext.Provider value={value}>
              {children }
            </InterviewContext.Provider>
        )
    
}


export default InterviewContextProvider;

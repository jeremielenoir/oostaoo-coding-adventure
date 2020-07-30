import React, {useState} from 'react';
import jwt from 'jsonwebtoken';

export const InterviewContext = React.createContext();

export default (props) => {

    const [interviewId, setInterviewId] = useState('');
    const [email, setEmail] = useState('ahmadinejad@gmail.com');
    const [nom, setNom] = useState('');

    const key = 'roodeo';
    
    const decryptHash = async (hash) => {
        try{
            const decrypted = await jwt.verify(hash, key);
            let { interview_id, candidat: {email, nom='jimmy'}} = decrypted;  
            console.log('Context// interview_id: ', interview_id, 'email : ', email);
            setInterviewId(interview_id);
            setEmail(email);
            setNom(nom);        
        } catch(error) {
            console.error('decryptHash: ', error);
        }   
    }


    const value = {interviewId, decryptHash, email, nom};

        return  (<InterviewContext.Provider value={{interviewId, key, email, decryptHash}}>
                  {props.children}
                </InterviewContext.Provider>)
}



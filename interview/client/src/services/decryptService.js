
import jwt from 'jsonwebtoken';

const key = 'roodeo';

export const decryptHash = async (hash) => {
    console.log('hassssssh: ', hash)
        try{
            const decrypted =
             await jwt.verify(hash, key);
            const {interview_id, candidat: {nom, email} } = decrypted;
            console.log('nom : ', nom)
            return {interview_id, nom, email}; 
        } catch(error) {
            console.error('decryptHash: ', error);
        }   
    }






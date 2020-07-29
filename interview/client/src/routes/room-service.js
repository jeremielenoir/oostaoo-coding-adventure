import jwt from 'jsonwebtoken';

function createRoom(){
}

export async function decrypteHash(interviewID){
    try{
        const key = 'roodeo';
        // const infosHash = props.match.params.interviewID;
        const decrypted = await jwt.verify(interviewID, key);
        // const { interview_id, candidat: {email}} = decrypted;  
        console.log('je suis le hash: ', decrypted);
        return decrypted;
    } catch(error) {
        console.log('decrypteHash: ', error);
    }   
}

function connecteToRoom(){
}

function sendMessage(){
}
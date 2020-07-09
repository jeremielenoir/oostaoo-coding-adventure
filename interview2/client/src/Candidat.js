import React, {useContext} from 'react';

const Candidat = (props) => {
    const { id, nom, prenom, email, selectCandidate, unselectCandidate, selectedCandidates } = props;
    return (
        <div
        onClick={()=>selectCandidate(id)}>
            {prenom} {nom}
        { selectedCandidates.length > 0 && selectedCandidates.some(c=>c.id == id) &&
            <button
                onClick={()=>{
                    selectCandidate(id)
                }}
                    >X</button>
        }
        </div>
    )
}

export default Candidat;
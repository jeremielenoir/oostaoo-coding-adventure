import React from 'react';
import SelectedCandidates from './SelectedCandidates';
import './Candidats.css';

export default ({redirect}) => {
    return (
        <div className="candidats">
            <SelectedCandidates redirect={redirect}/>
        </div>
    )
}
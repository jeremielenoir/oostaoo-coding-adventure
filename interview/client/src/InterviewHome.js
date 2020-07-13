import React, { useContext, useEffect } from 'react';
import './InterviewHome.css';
import Title from './Title';
import Candidats from './Candidats';
import {InterviewContext} from './context/InterviewContext'; 
import Interview from './Interview';

class InterviewHome extends React.Component{


  render(){
    return (
      <InterviewContext.Consumer>
        {value=><div className="interviewHome">
          <Title name={value.name} />
          <Candidats redirect={this.props.history.push}/>
        </div>}
      </InterviewContext.Consumer>
    )
  }
} 
  


export default InterviewHome;
import React, { Component } from "react";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Content from "./components/Content/Content";
import InterviewHome from './InterviewHome';
import ChatRoom from './ChatRoom';
import "./Interview.css";
import InterviewContextProvider from './context/InterviewContext';
import VideoChatRoom from './VideoChatRoom';

class Interview extends Component {
  
  render() {
    return (
      <div className="interview">
        <InterviewContextProvider>
          <BrowserRouter>
            <Switch>
              <Route path='/chatRoom/:id' component={ChatRoom} />
              <Route path='/videoChatRoom' component={VideoChatRoom} />
              <Route path='/' component={InterviewHome} />
            </Switch>    
          </BrowserRouter>
        </InterviewContextProvider>
      </div>
    );
  }
}

export default Interview;

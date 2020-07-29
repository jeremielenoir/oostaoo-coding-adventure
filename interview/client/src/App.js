import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";

//import HomeInterview from "./routes/HomeInterview";
import Room from "./routes/Room";

import './App.css';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#55b4da',
      main: '#2ba2d1',
      dark: '#1e7192',
      contrastText: '#fff',
    },
    secondary: {
      light: '#e87251',
      main: '#e34f26',
      dark: '#9e371a',
      contrastText: '#000',
    },
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
            {/* <Route exact path="/room" component={HomeInterview} />   */}
            <Route path="/rooms/:interviewID" component={Room} />
        </BrowserRouter> 
      </ThemeProvider>
    </div>
  );
}

export default App;

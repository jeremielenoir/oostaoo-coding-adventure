import React, { useContext, useState } from 'react';
import { BrowserRouter, Route } from "react-router-dom";

import { EndPointContext } from './useContext';
// import UrlPathLocation from './useContext';

//import HomeInterview from "./routes/HomeInterview";
import Room from "./components/Room";
import InterviewDeconnect from './pages/InterviewDeconnect';

import './assets/css/App.css';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#84cfe0',
      main: '#1a73e8',
      dark: '#2094bd',
      contrastText: '#fff',
    },
    secondary: {
      light: '#e87251',
      main: '#9e371a',
      /* dark: '#9e371a', */
     /*  contrastText: '#303030', */
    },
  },
});

function App() {
  const secret_key = process.env.REACT_APP_REST_API_LOCATION;
  const node = process.env.REACT_APP_ORIGIN_FILE;
  console.log(process.env);


const [locationPath, setLocationPath] = useState(secret_key);

  return (
    <div className="App">
      <h1>{secret_key}</h1>
      <h1>{node}</h1>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <EndPointContext.Provider value={secret_key}>
            <Route path="/rooms/:hash" component={Room} />
            <Route exact path="/InterviewDeconnect" component={InterviewDeconnect} />
          </EndPointContext.Provider>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;

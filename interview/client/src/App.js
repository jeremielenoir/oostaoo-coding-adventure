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
      main: '#4b3c4e',
      dark: '',
      contrastText: '#fff',
    },
    secondary: {
      light: '#e87251',
      main: '#e34f26',
      dark: '#9e371a',
      contrastText: '#000',
    },
    trois: {
      main: '#7a5285',
    },
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
          <BrowserRouter>
              <Route path="/rooms/:hash" component={Room} />
          </BrowserRouter> 
      </ThemeProvider>
    </div>
  );
}

export default App;

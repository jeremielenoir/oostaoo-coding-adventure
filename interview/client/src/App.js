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
      light: '#84cfe0',
      main: '#1a73e8',
      dark: '#2094bd',
      contrastText: '#fff',
    },
    secondary: {
      light: '#e87251',
      main: '#9e371a',
      dark: '#9e371a',
      contrastText: '#303030',
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

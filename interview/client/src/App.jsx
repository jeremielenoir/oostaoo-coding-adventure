import React from 'react';

import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import { EndPointContext } from './useContext';
// import UrlPathLocation from './useContext';

import Routes from './common/routes';

import './assets/css/App.css';
import { StreamContextProvider } from './common/StreamContext';

const theme = createTheme({
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
  const secretKey = process.env.REACT_APP_REST_API_LOCATION;
  const node = process.env.REACT_APP_ORIGIN_FILE;
  // console.log(process.env);

  // const [locationPath, setLocationPath] = useState(secretKey);

  return (
    <div className="App">
      <h1>{secretKey}</h1>
      <h1>{node}</h1>
      <ThemeProvider theme={theme}>
        <EndPointContext.Provider value={secretKey}>
          <StreamContextProvider>
              <Routes />
          </StreamContextProvider>
        </EndPointContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;

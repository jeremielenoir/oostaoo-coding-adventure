import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import App from './App';
// import { EndPointContext } from './useContext';
import * as serviceWorker from './services/serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    {/* <EndPointContext.Provider value="hello from context"> */}
    <App />
    {/* </EndPointContext.Provider> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

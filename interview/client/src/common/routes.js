import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import LoggedOffPage from '../components/LoggedOffPage/LoggedOffPage';
import Room from '../components/Room/Room';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route path="/rooms/:hash" component={Room} />
      <Route exact path="/LoggedOffPage" component={LoggedOffPage} />
    </BrowserRouter>
  );
};
export default Routes;

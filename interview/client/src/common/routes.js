import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import LoggedOffPage from '../Pages/LoggedOffPage/LoggedOffPage';
import InterviewHomePage from '../Pages/InterviewHomePage/InterviewHomePage';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route path="/rooms/:hash" component={InterviewHomePage} />
      <Route exact path="/LoggedOffPage" component={LoggedOffPage} />
    </BrowserRouter>
  );
};
export default Routes;

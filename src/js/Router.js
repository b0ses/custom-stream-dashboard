import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import Home from './Home';
import Login from './Login';
import Auth from './Auth';

const Router = () => (
  <Switch>
    <PrivateRoute exact path="/" component={Home} />
    <Route exact path="/auth" component={Auth} />
    <Route exact path="/login" component={Login} />
  </Switch>
);
export default Router;

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import Home from './Home';
import Login from './Login';
import TwitchAuth from './TwitchAuth';
import HueAuth from './HueAuth';

const Router = () => (
  <Switch>
    <PrivateRoute exact path="/" component={Home} />
    <Route exact path="/twitch_auth" component={TwitchAuth} />
    <Route exact path="/hue_auth" component={HueAuth} />
    <Route exact path="/login" component={Login} />
  </Switch>
);
export default Router;

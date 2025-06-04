import React from 'react';
import { Switch, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import Home from './Home';
import Login from './Login';
import TwitchAuth from './TwitchAuth';
import HueAuth from './HueAuth';

const Router = () => (
  <Routes>
    <Route exact path="/" element={<PrivateRoute><Home/></PrivateRoute>} />
    <Route exact path="/twitch_auth" element={TwitchAuth} />
    <Route exact path="/hue_auth" element={HueAuth} />
    <Route exact path="/login" element={Login} />
  </Routes>
);
export default Router;

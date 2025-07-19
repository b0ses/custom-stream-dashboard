import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { isAuthenticated } from './TwitchAuth';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : useNavigate("/login", state={ from: props.location });
};
export default PrivateRoute;

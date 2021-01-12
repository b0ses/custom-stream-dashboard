import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { isAuthenticated } from './TwitchAuth';

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      component={props => (isAuthenticated()
        ? (
          <Component {...props} />
        )
        : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      )}
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.shape({}),
  location: PropTypes.shape({})
};

PrivateRoute.defaultProps = {
  component: null,
  location: null
};

export default PrivateRoute;

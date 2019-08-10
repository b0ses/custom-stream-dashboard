import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './Auth';

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

export default PrivateRoute;

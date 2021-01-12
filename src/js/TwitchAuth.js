import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import api from './helpers/api';

const queryString = require('query-string');
const kGlobalConstants = require('./Settings').default;

export function isAuthenticated() {
  return (localStorage.getItem('loggedIn') != null || !kGlobalConstants.LOGIN);
}

class TwitchAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      errorMessage: null
    };

    this.validate = this.validate.bind(this);
  }

  validate(authCode) {
    api.request('auth/twitch_login', { code: authCode }).then((resp) => {
      if (resp.status === 200) {
        console.log('Successfully authorized');
        localStorage.setItem('loggedIn', true);
        this.setState({ redirectToReferrer: true });
      } else {
        const errorMessage = resp.data.message;
        this.setState({ errorMessage });
      }
    });
  }

  render() {
    const { location } = this.props;
    const { search } = location;
    const parsed = queryString.parse(search);
    const { from } = location.state || { from: { pathname: '/' } };
    const { code } = parsed;
    const { redirectToReferrer } = this.state;
    const { errorMessage } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    if (errorMessage != null) {
      return <h4>{errorMessage}</h4>;
    }
    if (code != null) {
      this.validate(code);
    }
    return (null);
  }
}

TwitchAuth.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.string,
    search: PropTypes.string
  })
};

TwitchAuth.defaultProps = {
  location: null
};

export default TwitchAuth;

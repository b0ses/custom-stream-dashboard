import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import api from './helpers/api';

import queryString from 'query-string';
const kGlobalConstants = require('./Settings').default;

export function isAuthenticated() {
  return (localStorage.getItem('loggedIn') != null || !kGlobalConstants.LOGIN);
}

class HueAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      errorMessage: null
    };

    this.validate = this.validate.bind(this);
  }

  validate(authCode) {
    api.request('auth/hue_login', { code: authCode }).then((resp) => {
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
      useNavigate(from);
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

HueAuth.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.string,
    search: PropTypes.string
  })
};

HueAuth.defaultProps = {
  location: null
};

export default HueAuth;

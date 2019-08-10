import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
// import { Receiver } from './Login';
import { OauthReceiver } from 'react-oauth-flow';

const jwtDecode = require('jwt-decode');
const kGlobalConstants = require('./Settings').default;

export function isAuthenticated() {
  return (localStorage.getItem('id') != null || !kGlobalConstants.LOGIN);
}

function gatherUserDetails(idToken) {
  const userDetails = jwtDecode(idToken);
  const { sub } = userDetails;
  const emailVerified = userDetails.email_verified;
  const preferredUsername = userDetails.preferred_username;
  const { picture } = userDetails;
  return {
    id: sub,
    emailVerified,
    username: preferredUsername,
    picture
  };
}

function handleError(error) {
  console.error('An error occured');
  console.error(error.message);
}

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = { redirectToReferrer: false };

    this.handleSuccess = this.handleSuccess.bind(this);
  }

  async handleSuccess(accessToken, { response, state }) {
    const refreshToken = response.refresh_token;
    const idToken = response.id_token;
    const userDetails = gatherUserDetails(idToken);
    const { emailVerified } = userDetails;
    if (emailVerified) {
      console.log('Successfully authorized');
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      Object.keys(userDetails).map(key => localStorage.setItem(key, userDetails[key]));
      this.setState({ redirectToReferrer: true });
    } else {
      const error = {
        message: 'Email not verified'
      };
      handleError(error);
    }
  }

  render() {
    const { location } = this.props;
    const { from } = location.state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <OauthReceiver
        tokenUrl="https://id.twitch.tv/oauth2/token"
        clientId={kGlobalConstants.CLIENT_ID}
        clientSecret={kGlobalConstants.CLIENT_SECRET}
        redirectUri={kGlobalConstants.REDIRECT_URI}
        onAuthSuccess={this.handleSuccess}
        onAuthError={handleError}
        render={({ processing, state, error }) => (
          <div className="login">
            {processing && <p>Authorizing...</p>}
            {error && (
              <p className="error">
                An error occured:
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    );
  }
}

Auth.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.string
  })
};

Auth.defaultProps = {
  location: null
};

export default Auth;

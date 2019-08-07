import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// import { Receiver } from './Login';
import { OauthReceiver } from 'react-oauth-flow';

var jwtDecode = require('jwt-decode');
const kGlobalConstants = require('./Settings').default;

export const isAuthenticated = () => {
  return (localStorage.getItem('id') != null)
};

class Auth extends Component {
  state = { redirectToReferrer: false };

  gatherUserDetails(idToken) {
    const userDetails = jwtDecode(idToken);
    const { sub } = userDetails;
    const { email_verified } = userDetails;
    const { preferred_username } = userDetails;
    const { picture } = userDetails;
    return {
      id: sub,
      email_verified: email_verified,
      username: preferred_username,
      picture: picture
    }
  }

  handleSuccess = async (accessToken, { response, state }) => {
    const { refresh_token } = response;
    const { id_token } = response;
    const userDetails = this.gatherUserDetails(id_token);
    const { email_verified } = userDetails;
    if (email_verified) {
      console.log('Successfully authorized');
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refresh_token);
      Object.keys(userDetails).map(key =>
        localStorage.setItem(key, userDetails[key])
      );
      this.setState({ redirectToReferrer: true });
    }
    else {
      const error = {
        message: "Email not verified"
      }
      this.handleError(error);
    }
  }
 
  handleError = error => {
    console.error('An error occured');
    console.error(error.message);
  }
 
  render() {
    let { from } = this.props.location.state || { from: { pathname: "/" } };
    let { redirectToReferrer } = this.state;

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
        onAuthError={this.handleError}
        render={({ processing, state, error }) => (
          <div className="login">
            {processing && <p>Authorizing...</p>}
            {error && (
              <p className="error">An error occured: {error.message}</p>
            )}
          </div>
        )}
      />
    );
  }
}

export default Auth;
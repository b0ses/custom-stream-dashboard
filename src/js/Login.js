// De-comment when createOauthFlow is fixed ("ReferenceError: h is not defined")
// for more details - https://github.com/adambrgmn/react-oauth-flow/issues/32

// import { createOauthFlow } from 'react-oauth-flow';
 
// const { Sender, Receiver } = createOauthFlow({
//   authorizeUrl: '',
//   clientId: '',
//   clientSecret: '',
//   redirectUri: '',
// });

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { OauthSender } from 'react-oauth-flow';

const kGlobalConstants = require('./Settings').default;

const claims = {
  id_token: {
    preferred_username: null,
    picture: null,
    email_verified: null
  }
}

export default class Login extends Component {
  render() {
    return (
      <OauthSender
        authorizeUrl="https://id.twitch.tv/oauth2/authorize"
        clientId={kGlobalConstants.CLIENT_ID}
        redirectUri={kGlobalConstants.REDIRECT_URI}
        state={{ from: '/settings' }}
        args={{ 
          response_type: 'code',
          scope: 'openid',
          claims: JSON.stringify(claims)
        }}
        render={({ url }) => (
          <div className="login">
            <h1>Stream Tools</h1>
            <a className="login-button" href={url}>Login with Twitch</a>
            <p> If you're worried about logging in, here's the code: </p>
            <a href="https://github.com/b0ses/custom-stream-dashboard" target="blank">Custom Stream Dashboard</a><br />
            <a href="https://github.com/b0ses/custom-stream-api" target="blank">Custom Stream API</a><br />
            <a href="https://github.com/b0ses/custom-stream-overlay" target="blank">Custom Stream Overlay</a>
          </div>
        )}
      />
    )
  }
};



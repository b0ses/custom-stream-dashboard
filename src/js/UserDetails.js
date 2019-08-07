import React, { Component } from 'react';
import Auth, { sharedAuth } from './Auth';
import { withRouter } from 'react-router-dom';

class UserDetails extends Component {

  logout() {
    localStorage.clear();
  }

  render() {
    const userID = localStorage.getItem('id');
    if (userID != null) {
      const username = localStorage.getItem('username');
      const picture = localStorage.getItem('picture');
      const backgroundStyle = {
        backgroundImage: `url(${picture})`
      };
      return (
        <div id="user-details">
          <div>
            <p> Logged in as { username } </p>
            <a href="/" onClick={this.logout}>Logout</a>
          </div>
          <div className={`circle button-background image-background`} style={backgroundStyle} /> 
        </div>
      )
    }
    else {
      return (null)
    }
  }
};

export default UserDetails;
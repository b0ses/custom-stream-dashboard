import React, { Component } from 'react';

import api from './helpers/api';

function logout() {
  api.request('auth/logout', null);
  localStorage.clear();
}

class UserDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      picture: null
    };
  }

  componentDidMount() {
    api.request('auth/current_user', null).then((resp) => {
      if (resp.status === 200) {
        const { data } = resp;
        this.setState({
          username: data.username,
          picture: data.picture
        });
      }
    });
  }

  render() {
    const { username, picture } = this.state;
    if (username) {
      const backgroundStyle = {
        backgroundImage: `url(${picture})`
      };
      return (
        <div id="user-details">
          <div>
            <p>
              Logged in as&nbsp;
              { username }
            </p>
            <a href="/" onClick={logout}>Logout</a>
          </div>
          <div className="circle button-background image-background" style={backgroundStyle} />
        </div>
      );
    }
    return (null);
  }
}

export default UserDetails;

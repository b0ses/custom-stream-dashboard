import React from 'react';

const kGlobalConstants = require('./Settings').default;

function logout() {
  localStorage.clear();
}

const UserDetails = () => {
  const userID = localStorage.getItem('id');
  if (userID != null && kGlobalConstants.LOGIN) {
    const username = localStorage.getItem('username');
    const picture = localStorage.getItem('picture');
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
};

export default UserDetails;

import React from 'react';

function logout() {
  localStorage.clear();
}

const UserDetails = () => {
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
          <p>
            Logged in as
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

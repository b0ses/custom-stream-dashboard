import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { goToAnchor } from 'react-scrollable-anchor';

import api from './helpers/api';

class Alert extends Component {
  constructor(props) {
    super(props);

    this.alert = this.alert.bind(this);
    this.editAlert = this.editAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
  }

  alert() {
    const {
      alertData: {
        name
      }
    } = this.props;
    const savedAlertData = {
      name
    };
    api.request('alerts/alert', savedAlertData);
  }

  editAlert(event) {
    event.preventDefault();
    const { alertData, setEditAlert } = this.props;
    setEditAlert(alertData);
    goToAnchor('custom-alert');
  }

  removeAlert(event) {
    event.preventDefault();
    const {
      alertData: {
        name
      },
      refreshAlerts
    } = this.props;
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const removeData = {
        name
      };
      api.request('alerts/remove_alert', removeData, refreshAlerts);
    }
  }

  render() {
    const {
      alertData: {
        name,
        thumbnail
      }
    } = this.props;
    let buttonBackgroundClass = '';
    let alertButtonClass = null;
    let backgroundStyle = {};
    let buttonThumbnail = thumbnail;
    if (buttonThumbnail === '') {
      buttonThumbnail = '#DDD';
    }
    if (buttonThumbnail[0] === '#') {
      backgroundStyle = {
        backgroundColor: buttonThumbnail
      };
      buttonBackgroundClass = 'color-background';
      alertButtonClass = 'button-overlay';
    } else {
      backgroundStyle = {
        backgroundImage: `url(${buttonThumbnail})`
      };
      buttonBackgroundClass = 'image-background';
      alertButtonClass = 'transparent-overlay';
    }
    return (
      <div className="div-alert">
        <div className={`circle button-background ${buttonBackgroundClass}`} style={backgroundStyle} />
        <button className={`alert-button ${alertButtonClass}`} type="submit" value={name} onClick={this.alert} />
        <p title={name}>{ name }</p>
        <p>
          <a href="/" onClick={this.editAlert}>edit</a>
          &nbsp;
          <a href="/" onClick={this.removeAlert}>remove</a>
        </p>
      </div>
    );
  }
}

Alert.propTypes = {
  alertData: PropTypes.shape({
    name: PropTypes.string,
    text: PropTypes.string,
    sound: PropTypes.string,
    duration: PropTypes.number,
    effect: PropTypes.string
  }),
  refreshAlerts: PropTypes.func,
  setEditAlert: PropTypes.func
};

Alert.defaultProps = {
  alertData: null,
  refreshAlerts: null,
  setEditAlert: null
};

export default Alert;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from './helpers/api';

class Alert extends Component {
  constructor(props) {
    super(props);

    this.alert = this.alert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
  }

  alert() {
    api.request('alerts/alert', this.props);
  }

  removeAlert(event) {
    const { refreshAlerts } = this.props;
    api.request('alerts/remove_alert', this.props, refreshAlerts);
    event.preventDefault();
  }

  render() {
    const { name } = this.props;
    return (
      <div>
        <button type="submit" value={name} onClick={this.alert}>{ name }</button>
        <a href="/" onClick={this.removeAlert}>Remove</a>
      </div>
    );
  }
}

Alert.propTypes = {
  name: PropTypes.string,
  refreshAlerts: PropTypes.func
};

Alert.defaultProps = {
  name: '',
  refreshAlerts: null
};

export default Alert;

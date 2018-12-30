import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from './helpers/api';

class Alert extends Component {
  constructor(props) {
    super(props);

    this.alert = this.alert.bind(this);
    this.editAlert = this.editAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
  }

  alert() {
    api.request('alerts/alert', this.props);
  }

  editAlert(event) {
    event.preventDefault();
    const { alertData } = this.props;
    const { setEditAlert } = this.props;
    setEditAlert(alertData);
  }

  removeAlert(event) {
    event.preventDefault();
    const { alertData } = this.props;
    if (window.confirm(`Are you sure you want to delete ${alertData.name}?`)) {
      const { refreshAlerts } = this.props;
      const removeData = {
        name: alertData.name
      }
      api.request('alerts/remove_alert', removeData, refreshAlerts);
    }
  }

  render() {
    const { alertData } = this.props;
    const name = alertData.name;
    return (
      <div className="div-alert">
        <button className="alert-button" type="submit" value={name} onClick={this.alert} />
        <p title={name}>{ name }</p>
        <p>
          <a href="/" onClick={this.editAlert}>edit</a>&nbsp;
          <a href="/" onClick={this.removeAlert}>remove</a>
        </p>
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

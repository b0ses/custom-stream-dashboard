import React, { Component } from 'react';
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
    api.request('alerts/remove_alert', this.props, this.props.refreshAlerts);
    event.preventDefault();
  }

  render() {
    const { name } = this.props;
    return (
      <div>
        <button value={name} onClick={this.alert}>{ name }</button>
        <a href='/' onClick={this.removeAlert}>Remove</a>
      </div>
    );
  }
}

export default Alert;

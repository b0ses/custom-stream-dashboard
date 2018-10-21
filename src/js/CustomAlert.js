import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from './helpers/api';

class CustomAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      text: '',
      sound: '',
      duration: '',
      effect: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.saveAlert = this.saveAlert.bind(this);
  }

  saveAlert() {
    const { refreshAlerts } = this.props;
    api.request('alerts/add_alert', this.state, refreshAlerts);
  }

  handleChange(event) {
    const { id } = event.target;
    const { value } = event.target;

    this.setState({
      [id]: value
    });
  }

  handleSubmit(event) {
    const alertData = Object.assign({}, this.state);
    delete alertData.name;
    api.request('alerts/alert', alertData);
    event.preventDefault();
  }

  render() {
    const { name } = this.state;
    const { text } = this.state;
    const { sound } = this.state;
    const { duration } = this.state;
    const { effect } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="custom-alert">
            Text:
            <input id="text" type="text" value={text} onChange={this.handleChange} />
          </label>
          <label htmlFor="custom-alert">
            Sound:
            <input id="sound" type="text" value={sound} onChange={this.handleChange} />
          </label>
          <label htmlFor="custom-alert">
            Duration:
            <input id="duration" type="text" value={duration} onChange={this.handleChange} />
          </label>
          <label htmlFor="custom-alert">
            Effect:
            <input id="effect" type="text" value={effect} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <form onSubmit={this.saveAlert}>
          <label htmlFor="save-alert">
            Name:
            <input id="name" type="text" value={name} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Save" />
        </form>
      </div>
    );
  }
}

CustomAlert.propTypes = {
  refreshAlerts: PropTypes.func
};

CustomAlert.defaultProps = {
  refreshAlerts: null
};

export default CustomAlert;

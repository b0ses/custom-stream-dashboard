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
    this.customAlert = this.customAlert.bind(this);
    this.saveAlert = this.saveAlert.bind(this);
  }

  handleChange(event) {
    const { id } = event.target;
    const { value } = event.target;

    this.setState({
      [id]: value
    });
  }

  customAlert() {
    const alertData = Object.assign({}, this.state);
    delete alertData.name;
    api.request('alerts/alert', alertData);
  }

  saveAlert() {
    const { refreshAlerts } = this.props;
    api.request('alerts/add_alert', this.state, refreshAlerts);
  }

  render() {
    const { name } = this.state;
    const { text } = this.state;
    const { sound } = this.state;
    const { duration } = this.state;
    const { effect } = this.state;
    return (
      <div id="custom-alert-form">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="custom-alert">Text</label>
          <input id="text" type="text" value={text} placeholder="what appears" onChange={this.handleChange} />
          <label htmlFor="custom-alert">Sound</label>
          <input id="sound" type="text" value={sound} placeholder="what gets heard" onChange={this.handleChange} />
          <label htmlFor="custom-alert">Duration</label>
          <input id="duration" type="text" value={duration} placeholder="how long does it last (milliseconds)" onChange={this.handleChange} />
          <label htmlFor="custom-alert">Effect</label>
          <input id="effect" type="text" value={effect} placeholder="how it appears (ex. fade)" onChange={this.handleChange} />
          <label htmlFor="custom-alert">Name</label>
          <input id="name" type="text" value={name} placeholder="for saving" onChange={this.handleChange} />
          <p className="full-width">
            <button type="button" onClick={this.customAlert}>Submit</button>
            <button type="button" onClick={this.saveAlert}>Save</button>
          </p>
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

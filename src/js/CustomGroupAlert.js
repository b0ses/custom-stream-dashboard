import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from './helpers/api';

function generateOptions(arr, dblClickCallback) {
  return arr.map(name => <option key={name} onDoubleClick={dblClickCallback}>{name}</option>);
}

class CustomAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      alerts: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.saveGroupAlert = this.saveGroupAlert.bind(this);
    this.prePopulate = this.prePopulate.bind(this);
    this.addToGroup = this.addToGroup.bind(this);
    this.removeFromGroup = this.removeFromGroup.bind(this);
  }

  handleChange(event) {
    const { id } = event.target;
    const { value } = event.target;

    this.setState({
      [id]: value
    });
  }

  prePopulate(data) {
    this.setState(data);
  }

  saveGroupAlert() {
    const { refreshGroupAlerts } = this.props;
    const { name } = this.state;
    const { alerts } = this.state;
    const addGroupData = {
      group_name: name,
      alert_names: alerts
    };
    api.request('alerts/save_group', addGroupData, refreshGroupAlerts);

    // clear after saving
    this.setState({
      name: '',
      alerts: []
    });
  }

  addToGroup(event) {
    const { value } = event.target;
    const { alerts } = this.state;
    this.setState({
      alerts: [...alerts, value].sort()
    });
  }

  removeFromGroup(event) {
    const { value } = event.target;
    const { alerts } = this.state;
    const newAlerts = [...alerts];
    const index = newAlerts.indexOf(value);
    if (index !== -1) {
      newAlerts.splice(index, 1);
      this.setState({
        alerts: newAlerts.sort()
      });
    }
  }

  render() {
    const { allAlerts } = this.props;
    const { alerts } = this.state;
    const availAlerts = allAlerts.filter(x => !alerts.includes(x));
    const { name } = this.state;
    return (
      <div id="custom-group-alert-form">
        <form onSubmit={this.handleSubmit}>
          <div>
            <p>Available</p>
            <select id="avail-alerts" multiple>
              { generateOptions(availAlerts, this.addToGroup) }
            </select>
          </div>
          <div>
            <p>Current</p>
            <select id="group-alerts" multiple>
              { generateOptions(alerts, this.removeFromGroup) }
            </select>
          </div>
          <label htmlFor="custom-alert">Name</label>
          <input id="name" type="text" value={name} placeholder="for saving" onChange={this.handleChange} />
          <p className="full-width">
            <button type="button" onClick={this.saveGroupAlert}>Save</button>
          </p>
        </form>
      </div>
    );
  }
}

CustomAlert.propTypes = {
  refreshGroupAlerts: PropTypes.func,
  allAlerts: PropTypes.arrayOf(PropTypes.string)
};

CustomAlert.defaultProps = {
  refreshGroupAlerts: null,
  allAlerts: []
};

export default CustomAlert;

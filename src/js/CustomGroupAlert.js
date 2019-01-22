import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from './helpers/api';

function generateOptions(arr) {
  return arr.map(name => <option key={name}>{name}</option>);
}

class CustomAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      alerts: [],
      addAlerts: [],
      removeAlerts: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.saveGroupAlert = this.saveGroupAlert.bind(this);
    this.prePopulate = this.prePopulate.bind(this);
    this.addToGroup = this.addToGroup.bind(this);
    this.removeFromGroup = this.removeFromGroup.bind(this);
    this.addAlerts = this.addAlerts.bind(this);
    this.removeAlerts = this.removeAlerts.bind(this);
  }

  handleChange(event) {
    const { id } = event.target;
    const { value } = event.target;

    this.setState({
      [id]: value
    });
  }

  getSelectedValues(e) {
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    return value
  }

  addAlerts(e) {
    this.setState({
      addAlerts: this.getSelectedValues(e)
    });
  }

  removeAlerts(e) {
    this.setState({
      removeAlerts: this.getSelectedValues(e)
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
    event.preventDefault();
    const { addAlerts } = this.state;
    const { alerts } = this.state;
    this.setState({
      alerts: [...alerts, ...addAlerts].sort(),
      addAlerts: []
    });
  }

  removeFromGroup(event) {
    event.preventDefault();
    const { removeAlerts } = this.state;
    const { alerts } = this.state;
    var newAlerts = [...alerts];

    for (var i=0; i<removeAlerts.length; i++){
      var removeAlert = removeAlerts[i];
      let index = newAlerts.indexOf(removeAlert);
      if (index !== -1) {
        newAlerts.splice(index, 1);
      }
    }

    this.setState({
      alerts: newAlerts.sort(),
      removeAlerts: []
    });
  }

  render() {
    const { allAlerts } = this.props;
    const { alerts } = this.state;
    const availAlerts = allAlerts.filter(x => !alerts.includes(x));
    const { name } = this.state;
    return (
      <div id="custom-group-alert-form">
        <form onSubmit={this.handleSubmit}>
          <div className="two-lists-ui">
            <div className="left-list">
              <p>Available</p>
              <select id="avail-alerts" multiple value={this.state.addAlerts} onChange={this.addAlerts}>
                { generateOptions(availAlerts) }
              </select>
            </div>
            <div className="add-remove">
                <button onClick={this.addToGroup}>Add</button>
                <button onClick={this.removeFromGroup}>Remove</button>
            </div>
            <div className="right-list">
              <p>Current</p>
              <select id="group-alerts" multiple value={this.state.removeAlerts} onChange={this.removeAlerts}>
                { generateOptions(alerts) }
              </select>
            </div>
          </div>
          <p>
            <label htmlFor="custom-alert">Name</label>
            <input id="name" type="text" value={name} placeholder="for saving" onChange={this.handleChange} />
          </p>
          <p>
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

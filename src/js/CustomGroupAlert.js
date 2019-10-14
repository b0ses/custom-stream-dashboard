import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from './helpers/api';
import ColorPicker from './helpers/ColorPicker';

function generateOptions(arr) {
  return arr.map(name => <option key={name}>{name}</option>);
}

function getSelectedValues(event) {
  const { options } = event.target;
  const value = [];
  for (let i = 0, l = options.length; i < l; i += 1) {
    if (options[i].selected) {
      value.push(options[i].value);
    }
  }
  return value;
}

class CustomGroupAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      thumbnail: '',
      alerts: [],
      addAlerts: [],
      removeAlerts: []
    };

    this.colorPickerRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.changeThumbnail = this.changeThumbnail.bind(this);
    this.saveGroupAlert = this.saveGroupAlert.bind(this);
    this.prePopulate = this.prePopulate.bind(this);
    this.addToGroup = this.addToGroup.bind(this);
    this.removeFromGroup = this.removeFromGroup.bind(this);
    this.addAlerts = this.addAlerts.bind(this);
    this.removeAlerts = this.removeAlerts.bind(this);
  }

  handleChange(event) {
    const {
      target: {
        id,
        value
      }
    } = event;

    if (id === 'thumbnail') {
      this.colorPickerRef.current.setColor(value);
    }

    this.setState({
      [id]: value
    });
  }

  addAlerts(e) {
    this.setState({
      addAlerts: getSelectedValues(e)
    });
  }

  removeAlerts(e) {
    this.setState({
      removeAlerts: getSelectedValues(e)
    });
  }

  changeThumbnail(color) {
    this.setState({
      thumbnail: color
    });
  }

  prePopulate(data) {
    this.setState(data);
    this.colorPickerRef.current.setColor(data.thumbnail);
  }

  saveGroupAlert() {
    const { refreshGroupAlerts } = this.props;
    const { name, alerts, thumbnail } = this.state;
    const addGroupData = {
      group_name: name,
      alert_names: alerts,
      thumbnail
    };
    api.request('alerts/save_group', addGroupData).then(refreshGroupAlerts);

    // clear after saving
    this.setState({
      name: '',
      alerts: [],
      thumbnail: ''
    });
  }

  addToGroup(event) {
    event.preventDefault();
    const { addAlerts, alerts } = this.state;
    this.setState({
      alerts: [...alerts, ...addAlerts],
      addAlerts: []
    });
  }

  removeFromGroup(event) {
    event.preventDefault();
    const { removeAlerts, alerts } = this.state;
    const newAlerts = [...alerts];

    for (let i = 0; i < removeAlerts.length; i += 1) {
      const removeAlert = removeAlerts[i];
      const index = newAlerts.indexOf(removeAlert);
      if (index !== -1) {
        newAlerts.splice(index, 1);
      }
    }

    this.setState({
      alerts: newAlerts,
      removeAlerts: []
    });
  }

  render() {
    const { allAlerts } = this.props;
    const {
      alerts,
      addAlerts,
      removeAlerts,
      name,
      thumbnail
    } = this.state;
    const availAlerts = allAlerts.filter(x => !alerts.includes(x));
    return (
      <div>
        <div className="two-lists-ui">
          <div className="left-list">
            <p>Available</p>
            <select id="avail-alerts" multiple value={addAlerts} onChange={this.addAlerts}>
              { generateOptions(availAlerts) }
            </select>
          </div>
          <div className="add-remove">
            <button type="button" onClick={this.addToGroup}>Add</button>
            <button type="button" onClick={this.removeFromGroup}>Remove</button>
          </div>
          <div className="right-list">
            <p>Current</p>
            <select id="group-alerts" multiple value={removeAlerts} onChange={this.removeAlerts}>
              { generateOptions(alerts) }
            </select>
          </div>
        </div>
        <div className="custom-form">
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="custom-alert">Name</label>
            <input id="name" type="text" value={name} placeholder="for saving" onChange={this.handleChange} />
            <label htmlFor="custom-alert">Button</label>
            <div className="alert-thumbnail">
              <input id="thumbnail" type="text" value={thumbnail} placeholder="hex color" onChange={this.handleChange} />
              <ColorPicker ref={this.colorPickerRef} changeThumbnail={this.changeThumbnail} />
            </div>
            <p className="full-width">
              <button type="button" onClick={this.saveGroupAlert}>Save</button>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

CustomGroupAlert.propTypes = {
  refreshGroupAlerts: PropTypes.func,
  allAlerts: PropTypes.arrayOf(PropTypes.string)
};

CustomGroupAlert.defaultProps = {
  refreshGroupAlerts: null,
  allAlerts: []
};

export default CustomGroupAlert;

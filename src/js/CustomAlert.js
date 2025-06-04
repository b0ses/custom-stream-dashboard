import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from './helpers/api';
import ColorPicker from './helpers/ColorPicker';

class CustomAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      text: '',
      sound: '',
      duration: '',
      effect: '',
      thumbnail: ''
    };

    this.colorPickerRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.changeThumbnail = this.changeThumbnail.bind(this);
    this.customAlert = this.customAlert.bind(this);
    this.saveAlert = this.saveAlert.bind(this);
    this.prePopulate = this.prePopulate.bind(this);
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

  changeThumbnail(color) {
    this.setState({
      thumbnail: color
    });
  }

  prePopulate(data) {
    this.setState(data);
    this.colorPickerRef.current.setColor(data.thumbnail);
  }

  customAlert() {
    const alertData = Object.assign({}, this.state);
    delete alertData.name;
    const filtered = Object.keys(alertData)
      .filter(key => alertData[key] !== '')
      .reduce((obj, key) => {
        obj[key] = alertData[key];
        return obj;
      }, {});
    api.request('alerts/alert', filtered);
  }

  saveAlert() {
    const { refreshAlerts } = this.props;
    const alertData = Object.assign({}, this.state);
    const filtered = Object.keys(alertData)
      .filter(key => alertData[key] !== '')
      .reduce((obj, key) => {
        obj[key] = alertData[key];
        return obj;
      }, {});
    api.request('alerts/add_alert', filtered).then(refreshAlerts);

    // clear after saving
    this.setState({
      name: '',
      text: '',
      sound: '',
      duration: '',
      effect: '',
      thumbnail: ''
    });
  }

  render() {
    const {
      name,
      text,
      sound,
      duration,
      effect,
      thumbnail
    } = this.state;
    return (
      <div className="custom-form">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="custom-alert">Text</label>
          <input id="text" type="text" value={text} placeholder="what appears" onChange={this.handleChange} />
          <label htmlFor="custom-alert">Sound</label>
          <input id="sound" type="text" value={sound} placeholder="what gets heard" onChange={this.handleChange} />
          <label htmlFor="custom-alert">Effect</label>
          <input id="effect" type="text" value={effect} placeholder="how it appears (ex. fade)" onChange={this.handleChange} />
          <label htmlFor="custom-alert">Button</label>
          <div className="alert-thumbnail">
            <input id="thumbnail" type="text" value={thumbnail} placeholder="hex color or image url" onChange={this.handleChange} />
            <ColorPicker ref={this.colorPickerRef} changeThumbnail={this.changeThumbnail} />
          </div>
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

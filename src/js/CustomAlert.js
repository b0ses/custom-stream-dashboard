import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import api from './helpers/api';
import helper from './helpers/helper';

import ColorPicker from './helpers/ColorPicker';
import Alert from './Alert';

const kGlobalConstants = require('./Settings').default;

class CustomAlert extends Component {
  constructor(props) {
    super(props);
    
    this.tagCategories = ['reference', 'character', 'content'];
    this.effects = ['', 'fade'];

    this.state = {
      displayName: '',
      name: '',
      sound: '',
      effect: '',
      thumbnail: '',
      category: 'content',
      newAlert: true,
      statusMessage: '',
      showAssociationsButton: false,
      showSaveButton: false,
      lockName: false
    };

    this.colorPickerRef = React.createRef();

    this.loadAlert = this.loadAlert.bind(this);
    this.prePopulateAlert = this.prePopulateAlert.bind(this);
    this.prePopulateTag = this.prePopulateTag.bind(this);
    this.changeAlerts = this.changeAlerts.bind(this);
    this.changeTags = this.changeTags.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeThumbnail = this.changeThumbnail.bind(this);
    this.processAlertName = this.processAlertName.bind(this);
    this.processTagName = this.processTagName.bind(this);
    this.confirmAlert = this.confirmAlert.bind(this);
    this.confirmTag = this.confirmTag.bind(this);
    this.customAlert = this.customAlert.bind(this);
    this.saveAlert = this.saveAlert.bind(this);
    this.saveTag = this.saveTag.bind(this);
    this.cancel = this.cancel.bind(this);
    this.capitalize = this.capitalize.bind(this);
    this.switchToAlerts = this.switchToAlerts.bind(this);
    this.switchToTags = this.switchToTags.bind(this);
  }

  componentDidMount() {
    //
  }

  componentDidUpdate(prevProps) {
    if (prevProps.editMode !== this.props.editMode || prevProps.name !== this.props.name || prevProps.editType !== this.props.editType) {
      if (this.props.editMode === 'alert' && this.props.name !== null) {
        this.setState({lockName: this.props.editType === 'edit'});
        this.loadAlert(this.props.name);
      }
      else if (this.props.editMode === 'tag' && this.props.name !== null) {
        this.setState({lockName: this.props.editType === 'edit'});
        this.loadTag(this.props.name);
      }
    }
  }

  loadAlert(alertName) {
    if (alertName !== null && alertName !== '') {
      this.lookupAlert(alertName, this.prePopulateAlert);
    }
  }

  loadTag(tagName) {
    if (tagName !== null && tagName !== '') {
      this.lookupTag(tagName, this.prePopulateTag);
    }
  }

  lookupAlert(name, callback) {
    const params = {
      name
    }
    const queryParams = `?${queryString.stringify(params)}`;
    api.request(`alerts/alert_details${queryParams}`, null).then(callback);
  }

  lookupTag(name, callback) {
    const params = {
      name
    }
    const queryParams = `?${queryString.stringify(params)}`;
    api.request(`alerts/tag_details${queryParams}`, null).then(callback);
  }

  prePopulateAlert(resp) {
    const { data } = resp;
    const transformedData = {
      displayName: data.alert.text,
      name: data.alert.name,
      sound: data.alert.sound,
      effect: data.alert.effect,
      thumbnail: data.alert.thumbnail,
      newAlert: false,
      showAssociationsButton: true,
      showSaveButton: true,
      statusMessage: ''
    }
    this.setState(transformedData);
    this.colorPickerRef.current.setColor(data.thumbnail);
    this.props.setAssociations(data.alert.tags);
  }

  prePopulateTag(resp) {
    const { data } = resp;
    const transformedData = {
      displayName: data.tag.display_name,
      name: data.tag.name,
      thumbnail: data.tag.thumbnail,
      category: data.tag.category || 'content',
      newAlert: false,
      showAssociationsButton: true,
      showSaveButton: true,
      statusMessage: ''
    }
    this.setState(transformedData);
    this.colorPickerRef.current.setColor(data.thumbnail);
    this.props.setAssociations(data.tag.alerts);
  }

  handleChange(event) {
    const {
      target: {
        id,
        value
      }
    } = event;

    const { editMode } = this.props;
    const { lockName, statusMessage } = this.state;

    if (id === 'displayName' && !lockName) {
      const machineName = value.toLowerCase().replaceAll(/\s|-/g, '_').replaceAll(/[^\w\d]/g, '');
      this.handleChange({target: {id: 'name', value: machineName}});
    }

    if (id === 'thumbnail') {
      this.colorPickerRef.current.setColor(value);
    }

    if (id === 'name') {
      let updateMessage = statusMessage;

      const badName = (value === '' || /^.*[^a-z0-9_].*$/.test(value));
      if (/^.*[^a-z0-9_].*$/.test(value)){
          updateMessage = 'only lowercase and underscores in name';
      }
      else {
        if (editMode === 'alert'){
          this.processAlertName(value);
        }
        else {
          this.processTagName(value);
        }
      }
      this.setState({
        showAssociationsButton: !badName,
        showSaveButton: !badName,
        statusMessage: updateMessage
      });
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

  processAlertName = helper.debounce((value) => this.lookupAlert(value, this.confirmAlert))
  processTagName = helper.debounce((value) => this.lookupTag(value, this.confirmTag))
  
  confirmAlert(resp) {
    const { data } = resp;

    if (data.hasOwnProperty('alert')) {
      this.setState({
        newAlert: false,
        statusMessage: 'This will overwrite ' + resp.data.alert.name
      });
    }
    else {
      this.setState({
        newAlert: true,
        statusMessage: ''
      });
    }
  }

  confirmTag(resp) {
    const { data } = resp;

    if (data.hasOwnProperty('tag')) {
      this.setState({
        newAlert: false,
        statusMessage: 'This will overwrite ' + resp.data.tag.name
      });
    }
    else {
      this.setState({
        newAlert: true,
        statusMessage: ''
      });
    }
  }

  changeAlerts() {
    this.props.changeAlerts();
    this.setState({
      showAssociationsButton: false
    });
  }

  changeTags() {
    this.props.changeTags();
    this.setState({
      showAssociationsButton: false
    });
  }

  customAlert() {
    const { displayName, sound, effect } = this.state;
    const filtered = {
      text: displayName,
      sound,
      effect,
      live: kGlobalConstants.LIVE
    }
    api.request('alerts/alert', filtered);
  }

  cancel() {
    this.setState({
      displayName: '',
      name: '',
      sound: '',
      effect: '',
      thumbnail: '',
      newAlert: true,
      statusMessage: '',
      category: 'content',
      showAssociationsButton: false,
      showSaveButton: false,
      lockName: false
    });
    this.props.resetAlerts();
  }

  saveAlert() {
    const { name, displayName, sound, effect, thumbnail } = this.state;
    const { associations } = this.props;
    const alertData = {
      name,
      text: displayName,
      sound,
      effect,
      thumbnail,
      tags: associations
    };
    const filtered = Object.keys(alertData)
      .filter(key => alertData[key] !== '')
      .reduce((obj, key) => {
        obj[key] = alertData[key];
        return obj;
      }, {});
    
    
    api.request('alerts/save_alert', filtered).then((resp) => {
      this.setState({
        displayName: '',
        name: '',
        sound: '',
        effect: '',
        thumbnail: '',
        newAlert: true,
        statusMessage: resp.data.message,
        showAssociationsButton: false,
        showSaveButton: false,
        lockName: false
      })
      this.props.resetAlerts();
    });
  }

  saveTag() {
    const { displayName, name, thumbnail, category } = this.state;
    const { associations } = this.props;
    const tagData = {
      display_name: displayName,
      name,
      thumbnail,
      category,
      alerts: associations
    };
    const filtered = Object.keys(tagData)
      .filter(key => tagData[key] !== '')
      .reduce((obj, key) => {
        obj[key] = tagData[key];
        return obj;
      }, {});
    
    
    api.request('alerts/save_tag', filtered).then((resp) => {
      this.setState({
        displayName: '',
        name: '',
        sound: '',
        effect: '',
        thumbnail: '',
        category: 'content',
        newAlert: true,
        statusMessage: resp.data.message,
        showAssociationsButton: true
      })
      this.props.resetAlerts();
    });
  }

  capitalize(s) {
    // returns the first letter capitalized + the string from index 1 and out aka. the rest of the string
    return s[0].toUpperCase() + s.substr(1);
  }

  switchToAlerts(){
    this.setState({
      displayName: '',
      name: '',
      sound: '',
      effect: '',
      thumbnail: '',
      newAlert: true,
      statusMessage: '',
      showAssociationsButton: false,
      showSaveButton: false
    });
    this.props.switchMode('alert');
  }

  switchToTags(){
    this.setState({
      displayName: '',
      name: '',
      sound: '',
      effect: '',
      thumbnail: '',
      newAlert: true,
      statusMessage: '',
      category: 'content',
      showAssociationsButton: false,
      showSaveButton: false,
    });
    this.props.switchMode('tag');
  }

  render() {
    const {
      displayName,
      name,
      sound,
      effect,
      thumbnail,
      category,
      newAlert,
      statusMessage,
      showAssociationsButton,
      showSaveButton,
      lockName
    } = this.state;
    const { editMode } = this.props;

    const alertData = {
      name,
      display_name: displayName,
      thumbnail
    }

    return (
      <div className="custom-alert">
        {editMode === 'alert' ? (
          <h3>{newAlert ? 'New ' : 'Update '}Sound / <button onClick={this.switchToTags}>Tag</button></h3>
        ) : (
          <h3>{newAlert ? 'New ' : 'Update '}<button onClick={this.switchToAlerts}>Sound</button> / Tag</h3>
        )}
        <div className="custom-alert-wrapper">
          <div className="custom-form">
              {editMode == 'alert' ? (
                  <form onSubmit={this.handleSubmit}>
                    <label htmlFor="custom-alert">Display Name</label>
                    <input id="displayName" type="text" value={displayName} placeholder="display name and what appears on screen" onChange={this.handleChange} />
                    <label htmlFor="custom-alert">Name</label>
                    <input id="name" type="text" value={name} placeholder="unique name for database to reference via chat" onChange={this.handleChange} disabled={lockName}/>
                    <label htmlFor="custom-alert">Sound</label>
                    <input id="sound" type="text" value={sound} placeholder="what gets heard (.mp3, .wav)" onChange={this.handleChange} />
                    <label htmlFor="custom-alert">Effect</label>
                    <select id="effect" value={effect} placeholder="any effects to the text/sound" onChange={this.handleChange}>
                      {this.effects.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <label htmlFor="custom-alert">Button</label>
                    <div className="alert-thumbnail">
                      <input id="thumbnail" type="text" value={thumbnail} placeholder="image url or hex color below" onChange={this.handleChange} />
                      <ColorPicker ref={this.colorPickerRef} changeThumbnail={this.changeThumbnail} />
                    </div>
                    <label htmlFor="custom-alert">Tags</label>
                    {showAssociationsButton ? (<button type="button" onClick={this.changeTags}>Set Tags</button>) : null}
                  </form>
              ) : (
                  <form onSubmit={this.handleSubmit}>
                    <label htmlFor="custom-alert">Display Name</label>
                    <input id="displayName" type="text" value={displayName} placeholder="display name" onChange={this.handleChange} />
                    <label htmlFor="custom-alert">Name</label>
                    <input id="name" type="text" value={name} placeholder="unique name for database to reference via chat" onChange={this.handleChange} disabled={lockName}/>
                    <label htmlFor="custom-alert">Button</label>
                    <div className="alert-thumbnail">
                      <input id="thumbnail" type="text" value={thumbnail} placeholder="image url or hex color below" onChange={this.handleChange} />
                      <ColorPicker ref={this.colorPickerRef} changeThumbnail={this.changeThumbnail} />
                    </div>
                    <label htmlFor="custom-alert">Sounds</label>
                    {(showAssociationsButton && name !== 'random') ? (<button type="button" onClick={this.changeAlerts}>Set Sounds</button>) : null}
                    <label htmlFor="custom-alert">Tag Category</label>
                    <select id="category" value={category} onChange={this.handleChange}>
                      {this.tagCategories.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </form>
              )}
          </div>
          <div className="custom-preview">
            <h4>Preview</h4>
            <Alert
              key="preview"
              alertData={alertData}
              customAlert={this.customAlert}
              preview
            />
            <p id="save-status">{statusMessage}</p>
            <div className="custom-form-save">
              <button type="button" onClick={editMode === 'alert' ? this.saveAlert : this.saveTag} disabled={!showSaveButton}>{newAlert ? 'Save' : 'Update'}</button>
              <button type="button" onClick={this.cancel}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CustomAlert.propTypes = {
  resetAlerts: PropTypes.func,
  changeAlerts: PropTypes.func,
  changeTags: PropTypes.func,
  setAssociations: PropTypes.func,
  name: PropTypes.string,
  editMode: PropTypes.string
};

CustomAlert.defaultProps = {
  resetAlerts: null,
  changeAlerts: null,
  changeTags: null,
  setAssociations: null,
  name: '',
  editMode: 'alert'
};

export default CustomAlert;

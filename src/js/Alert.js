import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from './helpers/api';

const kGlobalConstants = require('./Settings').default;

class Alert extends Component {
  constructor(props) {
    super(props);

    this.alert = this.alert.bind(this);
    this.editAlert = this.editAlert.bind(this);
    this.editTag = this.editTag.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.toggleSelected = this.toggleSelected.bind(this);
  }

  alert() {
    const {
      alertData: {
        name
      }
    } = this.props;
    const savedAlertData = {
      name,
      live: kGlobalConstants.LIVE
    };
    if (!this.props.tag){
      api.request('alerts/alert', savedAlertData);
    }
    else {
      api.request('alerts/tag_alert', savedAlertData);
    }
  }

  editAlert(event) {
    event.preventDefault();
    const {
      alertData: {
        name
      }
    } = this.props;
    this.props.editAlert(name);
  }

  editTag(event) {
    event.preventDefault();
    const {
      alertData: {
        name
      }
    } = this.props;
    this.props.editTag(name);
  }

  removeAlert(event) {
    event.preventDefault();
    const {
      alertData: {
        name
      },
      resetAlerts
    } = this.props;
    if (window.confirm(`Are you sure you want to delete the sound: ${name}?`)) {
      const removeData = {
        name
      };

      api.request('alerts/remove_alert', removeData).then((resp) => {
        resetAlerts();
      });
    }
  }

  removeTag(event) {
    event.preventDefault();
    const {
      alertData: {
        name
      },
      resetAlerts
    } = this.props;
    if (window.confirm(`Are you sure you want to delete the tag: ${name}?`)) {
      const removeData = {
        name
      };

      api.request('alerts/remove_tag', removeData).then((resp) => {
        resetAlerts();
      });
    }
  }

  toggleSelected() {
    const {
      alertData: {
        name
      }
    } = this.props;
    this.props.toggleAssociation(name);
  }

  render() {
    const {
      alertData: {
        display_name: displayName,
        name,
        thumbnail
      }
    } = this.props;
    let buttonBackgroundClass = '';
    let backgroundStyle = {};
    let borderClass = '';
    if (this.props.selected){
      borderClass = 'selected';
    } else if (this.props.tag){
      borderClass = 'tag-alert';
    }
    
    let buttonThumbnail = thumbnail;
    if (!buttonThumbnail || buttonThumbnail === '') {
      buttonThumbnail = '#DDD';
    }

    if (buttonThumbnail[0] === '#') {
      backgroundStyle = {
        backgroundColor: buttonThumbnail,
      };
      buttonBackgroundClass = 'color-background';
    } else {
      backgroundStyle = {
        backgroundImage: `url(${buttonThumbnail})`
      };
      buttonBackgroundClass = 'image-background';
    }

    let buttonOnClick = null;
    if (this.props.preview) {
      buttonOnClick = this.props.customAlert;
    }
    else if (this.props.selectable) {
      buttonOnClick = this.toggleSelected;
    }
    else {
      buttonOnClick = this.alert;
    }

    return (
      <div className={`div-alert${this.props.preview ? ' preview' : ''} ${borderClass}`}>
        <button className={`button-background ${buttonBackgroundClass}`} style={backgroundStyle} type="submit" value={name} onClick={buttonOnClick} />
        <p className={`${this.props.selected ? 'selected' : ''} ${name.length > 10 ? 'marquee' : null}`} title={displayName}><span tabIndex='0'>{ displayName }</span></p>
        <p className={`${this.props.selected ? 'selected' : ''} ${name.length > 10 ? 'marquee' : null} sub-name`} title={name}><span tabIndex='1'>{ name }</span></p>
        { !this.props.preview && !this.props.selectable ? (
          <p>
            <button onClick={!this.props.tag ? this.editAlert : this.editTag}>edit</button>
            &nbsp;
            {this.props.tag && name === 'random' ? (null) : (
              <button onClick={!this.props.tag ? this.removeAlert: this.removeTag}>remove</button>
            )}
          </p>
        ) : <p /> }

      </div>
    );
  }
}

Alert.propTypes = {
  alertData: PropTypes.shape({
    name: PropTypes.string,
    thumbnail: PropTypes.string,
    text: PropTypes.string,
    sound: PropTypes.string,
    duration: PropTypes.number,
    effect: PropTypes.string
  }),
  resetAlerts: PropTypes.func,
  editAlert: PropTypes.func,
  editTag: PropTypes.func,
  toggleAssociation: PropTypes.func,
  tag: PropTypes.bool,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  preview: PropTypes.bool
};

Alert.defaultProps = {
  alertData: null,
  resetAlerts: null,
  editAlert: null,
  editTag: null,
  toggleAssociation: null,
  tag: false,
  selectable: false,
  selected: false,
  preview: false
};

export default Alert;

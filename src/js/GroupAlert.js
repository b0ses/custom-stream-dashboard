import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { goToAnchor } from 'react-scrollable-anchor';

import api from './helpers/api';

class GroupAlert extends Component {
  constructor(props) {
    super(props);

    this.groupAlert = this.groupAlert.bind(this);
    this.editGroupAlert = this.editGroupAlert.bind(this);
    this.removeGroupAlert = this.removeGroupAlert.bind(this);
  }

  groupAlert() {
    const { groupAlertData } = this.props;
    const savedGroupAlertData = {
      group_name: groupAlertData.name
    };
    api.request('alerts/group_alert', savedGroupAlertData);
  }

  editGroupAlert(event) {
    event.preventDefault();
    const { groupAlertData } = this.props;
    const { setEditGroupAlert } = this.props;
    const { refreshGroupAlerts } = this.props;
    setEditGroupAlert(groupAlertData);
    refreshGroupAlerts();
    goToAnchor('custom-group-alert');
  }

  removeGroupAlert(event) {
    event.preventDefault();
    const { groupAlertData } = this.props;
    if (window.confirm(`Are you sure you want to delete ${groupAlertData.name}?`)) {
      const { refreshGroupAlerts } = this.props;
      const removeData = {
        group_name: groupAlertData.name
      };
      api.request('alerts/remove_group', removeData, refreshGroupAlerts);
    }
  }

  render() {
    const {
      groupAlertData: {
        name,
        thumbnail
      }
    } = this.props;
    let buttonThumnail = thumbnail;
    let buttonBackgroundClass = '';
    let alertButtonClass = null;
    let backgroundStyle = {};
    if (buttonThumnail === '') {
      buttonThumnail = '#DDD';
    }
    if (buttonThumnail[0] === '#') {
      backgroundStyle = {
        backgroundColor: buttonThumnail
      };
      buttonBackgroundClass = 'color-background';
      alertButtonClass = 'button-overlay';
    } else {
      backgroundStyle = {
        backgroundImage: `url(${buttonThumnail})`
      };
      buttonBackgroundClass = 'image-background';
      alertButtonClass = 'transparent-overlay';
    }
    return (
      <div className="div-alert">
        <div className={`circle button-background ${buttonBackgroundClass}`} style={backgroundStyle} />
        <button className={`alert-button ${alertButtonClass}`} type="submit" value={name} onClick={this.groupAlert} />
        <p title={name}>{ name }</p>
        <p>
          <a href="/" onClick={this.editGroupAlert}>edit</a>
          &nbsp;
          <a href="/" onClick={this.removeGroupAlert}>remove</a>
        </p>
      </div>
    );
  }
}

GroupAlert.propTypes = {
  groupAlertData: PropTypes.shape({
    name: PropTypes.string
  }),
  refreshGroupAlerts: PropTypes.func,
  setEditGroupAlert: PropTypes.func
};

GroupAlert.defaultProps = {
  groupAlertData: null,
  refreshGroupAlerts: null,
  setEditGroupAlert: null
};

export default GroupAlert;

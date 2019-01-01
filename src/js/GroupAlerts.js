import React, { Component } from 'react';

import api from './helpers/api';
import CustomGroupAlert from './CustomGroupAlert';
import GroupAlert from './GroupAlert';

class GroupAlerts extends Component {
  constructor() {
    super();

    this.state = {
      groupAlerts: [],
      allAlerts: []
    };
    this.customGroupAlert = React.createRef();

    this.refreshGroupAlerts = this.refreshGroupAlerts.bind(this);
    this.setEditGroupAlert = this.setEditGroupAlert.bind(this);
    this.setGroupAlerts = this.setGroupAlerts.bind(this);
    this.setAlerts = this.setAlerts.bind(this);
  }

  componentDidMount() {
    this.refreshGroupAlerts();
  }

  setAlerts(data) {
    this.setState({
      allAlerts: data.map(alert => alert.name)
    });
  }

  setGroupAlerts(data) {
    const groupAlerts = [];
    for (let i = 0; i < data.length; i += 1) {
      const groupAlert = (<GroupAlert
        key={i}
        groupAlertData={data[i]}
        refreshGroupAlerts={this.refreshGroupAlerts}
        setEditGroupAlert={this.setEditGroupAlert}
      />
      );
      groupAlerts.push(groupAlert);
    }
    this.setState({
      groupAlerts
    });
  }

  setEditGroupAlert(editGroupAlert) {
    this.customGroupAlert.current.prePopulate(editGroupAlert);
  }

  refreshGroupAlerts() {
    api.request('alerts/', null, this.setAlerts);
    api.request('alerts/groups', null, this.setGroupAlerts);
  }

  render() {
    const { groupAlerts } = this.state;
    const { allAlerts } = this.state;
    return (
      <div>
        <div className="saved-group-alerts">
          <h3>Group Alerts</h3>
          <div className="grid">
            { groupAlerts }
          </div>
        </div>
        <div className="custom-group-alert">
          <h3>New Group Alert</h3>
          <CustomGroupAlert
            ref={this.customGroupAlert}
            refreshGroupAlerts={this.refreshGroupAlerts}
            allAlerts={allAlerts}
          />
        </div>
      </div>
    );
  }
}
export default GroupAlerts;

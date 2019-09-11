import React, { Component } from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';

import api from './helpers/api';
import CustomGroupAlert from './CustomGroupAlert';
import GroupAlert from './GroupAlert';

class GroupAlerts extends Component {
  constructor() {
    super();

    this.state = {
      groupAlertData: [],
      allAlerts: []
    };
    this.customGroupAlert = React.createRef();

    this.refreshGroupAlerts = this.refreshGroupAlerts.bind(this);
    this.generateGroupAlerts = this.generateGroupAlerts.bind(this);
    this.setEditGroupAlert = this.setEditGroupAlert.bind(this);
    this.setGroupAlerts = this.setGroupAlerts.bind(this);
    this.setAlerts = this.setAlerts.bind(this);
  }

  componentDidMount() {
    this.refreshGroupAlerts();
  }

  setAlerts(resp) {
    const { data } = resp;
    this.setState({
      allAlerts: data.map(alert => alert.name)
    });
  }

  setGroupAlerts(resp) {
    const { data } = resp;
    const groupAlertData = [];
    for (let i = 0; i < data.length; i += 1) {
      groupAlertData.push(data[i]);
    }
    this.setState({
      groupAlertData
    });
  }

  generateGroupAlerts(groupAlertData){
    const groupAlerts = [];
    for (let i = 0; i < groupAlertData.length; i += 1) {
      const groupAlert = (<GroupAlert
        key={i}
        groupAlertData={groupAlertData[i]}
        refreshGroupAlerts={this.refreshGroupAlerts}
        setEditGroupAlert={this.setEditGroupAlert}
      />
      );
      groupAlerts.push(groupAlert);
    }
    return groupAlerts;
  }

  setEditGroupAlert(editGroupAlert) {
    this.customGroupAlert.current.prePopulate(editGroupAlert);
  }

  refreshGroupAlerts() {
    api.request('alerts/', null).then(this.setAlerts);
    api.request('alerts/groups', null).then(this.setGroupAlerts);
  }

  render() {
    const { groupAlertData, allAlerts } = this.state;
    const groupAlerts = this.generateGroupAlerts(groupAlertData); 
    return (
      <div>
        <ScrollableAnchor id="saved-group-alerts">
          <h3>Group Alerts</h3>
        </ScrollableAnchor>
        <div className="saved-group-alerts">
          <div className="grid">
            { groupAlerts }
          </div>
        </div>
        <ScrollableAnchor id="custom-group-alert">
          <h3>New Group Alert</h3>
        </ScrollableAnchor>
        <div className="custom-group-alert">
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

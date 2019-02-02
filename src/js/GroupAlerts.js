import React, { Component } from 'react';

import api from './helpers/api';
import CustomGroupAlert from './CustomGroupAlert';
import GroupAlert from './GroupAlert';


function filterGroupAlerts(groupAlerts, search) {
  const searchTerms = search.split(' ');
  const filtered = groupAlerts.filter((alert) => {
    const {
      props: {
        groupAlertData: {
          name
        }
      }
    } = alert;
    let match = false;
    for (let i = 0; i < searchTerms.length; i += 1) {
      if (name.indexOf(searchTerms[i]) > -1) {
        match = true;
      }
    }
    return match;
  });
  return filtered;
}

class GroupAlerts extends Component {
  constructor() {
    super();

    this.state = {
      groupAlerts: [],
      allAlerts: [],
      search: ''
    };
    this.customGroupAlert = React.createRef();

    this.refreshGroupAlerts = this.refreshGroupAlerts.bind(this);
    this.setEditGroupAlert = this.setEditGroupAlert.bind(this);
    this.setGroupAlerts = this.setGroupAlerts.bind(this);
    this.setAlerts = this.setAlerts.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
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

  updateSearch(event) {
    const { value } = event.target;
    this.setState({
      search: value
    });
  }

  render() {
    const { groupAlerts } = this.state;
    const { allAlerts } = this.state;
    const { search } = this.state;
    const filteredAlerts = filterGroupAlerts(groupAlerts, search);
    return (
      <div>
        <h3>Group Alerts</h3>
        <div className="saved-group-alerts">
          <form className="search">
            <label htmlFor="custom-alert">Search</label>
            <input id="search-group-alerts" type="text" value={search} onChange={this.updateSearch} />
          </form>
          <div className="grid">
            { filteredAlerts }
          </div>
        </div>
        <h3>New Group Alert</h3>
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

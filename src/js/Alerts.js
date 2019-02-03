import React, { Component } from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';

import api from './helpers/api';
import CustomAlert from './CustomAlert';
import Alert from './Alert';

function filterAlerts(alerts, search) {
  const searchTerms = search.split(' ');
  const filtered = alerts.filter((alert) => {
    const {
      props: {
        alertData: {
          name
        }
      }
    } = alert;
    let match = false;
    for (let i = 0; i < searchTerms.length; i += 1) {
      if (name.toLowerCase().indexOf(searchTerms[i].toLowerCase()) > -1) {
        match = true;
      }
    }
    return match;
  });
  return filtered;
}

class Alerts extends Component {
  constructor() {
    super();

    this.state = {
      alerts: [],
      search: ''
    };
    this.customAlert = React.createRef();

    this.refreshAlerts = this.refreshAlerts.bind(this);
    this.setEditAlert = this.setEditAlert.bind(this);
    this.setAlerts = this.setAlerts.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  componentDidMount() {
    this.refreshAlerts();
  }

  setAlerts(data) {
    const alerts = [];
    for (let i = 0; i < data.length; i += 1) {
      const alert = (<Alert
        key={i}
        alertData={data[i]}
        refreshAlerts={this.refreshAlerts}
        setEditAlert={this.setEditAlert}
      />
      );
      alerts.push(alert);
    }
    this.setState({
      alerts
    });
  }

  setEditAlert(editAlert) {
    this.customAlert.current.prePopulate(editAlert);
  }

  updateSearch(event) {
    const {
      target: {
        value
      }
    } = event;
    this.setState({
      search: value
    });
  }

  refreshAlerts() {
    api.request('alerts/', null, this.setAlerts);
  }

  render() {
    const { alerts, search } = this.state;
    const filteredAlerts = filterAlerts(alerts, search);
    return (
      <div>
        <ScrollableAnchor id="saved-alerts">
          <h3>Alerts</h3>
        </ScrollableAnchor>
        <div className="saved-alerts">
          <form className="search">
            <label htmlFor="custom-alert">Search</label>
            <input id="search-alerts" type="text" value={search} onChange={this.updateSearch} />
          </form>
          <div className="grid">
            { filteredAlerts }
          </div>
        </div>
        <ScrollableAnchor id="custom-alert">
          <h3>New Alert</h3>
        </ScrollableAnchor>
        <div className="custom-alert">
          <CustomAlert ref={this.customAlert} refreshAlerts={this.refreshAlerts} />
        </div>
      </div>
    );
  }
}
export default Alerts;

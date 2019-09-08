import React, { Component } from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';

import api from './helpers/api';
import CustomAlert from './CustomAlert';
import Alert from './Alert';

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

  setAlerts(resp) {
    const { data } = resp;
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
    this.refreshAlerts(value);
  }

  refreshAlerts(search) {
    let queryParams = '';
    if (search){
      queryParams = '?search=' + search;
    }
    api.request('alerts/' + queryParams, null).then(this.setAlerts);
  }

  render() {
    const { alerts, search } = this.state;
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
            { alerts }
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

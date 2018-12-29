import React, { Component } from 'react';

import api from './helpers/api';
import CustomAlert from './CustomAlert';
import Alert from './Alert';

class App extends Component {
  constructor() {
    super();
    this.state = {
      alerts: []
    };

    this.refreshAlerts = this.refreshAlerts.bind(this);
    this.setAlerts = this.setAlerts.bind(this);
  }

  componentDidMount() {
    this.refreshAlerts();
  }

  setAlerts(data) {
    const alertNames = Array.from(data, x => x.name);
    const alerts = [];
    for (let i = 0; i < alertNames.length; i += 1) {
      alerts.push(<Alert key={i} name={alertNames[i]} refreshAlerts={this.refreshAlerts} />);
    }
    this.setState({
      alerts
    });
  }

  refreshAlerts() {
    api.request('alerts/', null, this.setAlerts);
  }

  render() {
    const { alerts } = this.state;
    return (
      <div>
        <div className="saved-alerts">
          <h3>Alerts</h3>
          <div className="grid">
            { alerts }
          </div>
        </div>
        <div className="custom-alert">
          <h3>Custom Alert</h3>
          <CustomAlert refreshAlerts={this.refreshAlerts} />
        </div>
      </div>
    );
  }
}
export default App;

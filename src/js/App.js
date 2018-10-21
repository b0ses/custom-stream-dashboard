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
      alerts.push(<Alert name={alertNames[i]} refreshAlerts={this.refreshAlerts} />);
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
        <h3>Custom Alerts:</h3>
        <div>
          { alerts }
        </div>
        <h3>Or do it manually:</h3>
        <CustomAlert refreshAlerts={this.refreshAlerts} />
      </div>
    );
  }
}
export default App;

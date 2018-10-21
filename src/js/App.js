import React, { Component } from 'react';

import api from './helpers/api';
import CustomAlert from './CustomAlert';
import Alert from './Alert';

class App extends Component {
  constructor() {
    super();
    this.state = {
      alerts: [],
    };

    this.refreshAlerts = this.refreshAlerts.bind(this);
    this.setAlerts = this.setAlerts.bind(this);
  }

  componentDidMount() {
    this.refreshAlerts();
  }

  refreshAlerts() {
    api.request('alerts/', null, this.setAlerts);
  }

  setAlerts(data) {
    const alert_names = Array.from(data, x => x['name']);
    let alerts = [];
    for (let i = 0; i < alert_names.length; i++) {             
      alerts.push(<Alert name={alert_names[i]} refreshAlerts={this.refreshAlerts}/>);   
    }
    this.setState({
      alerts
    });
  }

  render() {
    const { alerts } = this.state; 
    return (
      <div>
        <h3>Custom Alerts:</h3>
          <div>
            {alerts}
          </div>
        <h3>Or do it manually:</h3>
        <CustomAlert refreshAlerts={this.refreshAlerts}/>

      </div>
    );
  }
}
export default App;

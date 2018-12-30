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
    this.customAlert = React.createRef();

    this.refreshAlerts = this.refreshAlerts.bind(this);
    this.setEditAlert = this.setEditAlert.bind(this);
    this.setAlerts = this.setAlerts.bind(this);
  }

  componentDidMount() {
    this.refreshAlerts();
  }

  setAlerts(data) {
    const alerts = [];
    for (let i = 0; i < data.length; i += 1) {
      alerts.push(<Alert key={i} alertData={data[i]} refreshAlerts={this.refreshAlerts} setEditAlert={this.setEditAlert}/>);
    }
    this.setState({
      alerts
    });
  }

  setEditAlert(editAlert) {
    this.customAlert.current.prePopulate(editAlert); 
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
          <h3>New Alert</h3>
          <CustomAlert ref={this.customAlert} refreshAlerts={this.refreshAlerts} />
        </div>
      </div>
    );
  }
}
export default App;

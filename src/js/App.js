import React, { Component } from 'react';

import CustomAlert from './CustomAlert';

const kGlobalConstants = require('./Settings').default;

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: `${kGlobalConstants.API_HOST}:${kGlobalConstants.API_PORT}`
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    console.log(endpoint);
  }

  render() {
    return (
      <div>
        <CustomAlert />
      </div>
    );
  }
}
export default App;

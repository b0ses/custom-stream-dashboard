import React, { Component } from 'react';
import * as api from './helpers/api';

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
        <p>HELLO WORLD!</p>
      </div>
    );
  }
}
export default App;

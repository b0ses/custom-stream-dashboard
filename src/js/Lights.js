import React, { Component } from 'react';
import { v1 as uuid } from 'uuid';
import Slider from '@mui/material/Slider';
import { OauthSender } from 'react-oauth-flow';

import api from './helpers/api';
import ColorPicker from './helpers/ColorPicker';

const kGlobalConstants = require('./Settings').default;

class Lights extends Component {
  constructor() {
    super();

    this.state = {
      color: 'white',
      brightness: 5,
      loggedIn: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.changeBrightness = this.changeBrightness.bind(this);
    this.changeLights = this.changeLights.bind(this);
    this.colorPickerRef = React.createRef();
  }

  componentDidMount() {
    this.checkHueLoggedIn();
  }

  checkHueLoggedIn() {
    api.request('auth/hue_logged_in', null).then((resp) => {
      if (resp.status === 200) {
        const { data } = resp;
        this.setState({
          loggedIn: data.logged_in
        });
      }
    });
  }

  handleChange(event) {
    const {
      target: {
        id,
        value
      }
    } = event;

    if (id === 'light-color') {
      this.colorPickerRef.current.setColor(value);
    }

    this.setState({
      color: value
    });
  }

  changeColor(color) {
    this.setState({
      color
    });
  }

  changeBrightness(event, value) {
    console.log('brightness change');
    this.setState({
      brightness: value
    });
  }

  changeLights() {
    const lightData = Object.assign({}, this.state);
    console.log(lightData);
    const filtered = Object.keys(lightData)
      .filter(key => key !== 'loggedIn')
      .reduce((obj, key) => {
        obj[key] = lightData[key];
        return obj;
      }, {});
    api.request('lights/change_lights_static', filtered);
  }

  render() {
    const {
      color,
      loggedIn
    } = this.state;
    const lightsForm = (
      <div className="custom-form">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="custom-alert">Color</label>
          <div className="color-selector">
            <input id="light-color" type="text" value={color} placeholder="hex color" onChange={this.handleChange} />
            <ColorPicker ref={this.colorPickerRef} changeThumbnail={this.changeColor} />
          </div>
          <label htmlFor="custom-alert">Brightness</label>
          <div className="brightness-selector">
            <Slider
              defaultValue={5}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
              onChangeCommitted={this.changeBrightness}
            />
          </div>
          <p className="full-width">
            <button type="button" onClick={this.changeLights}>Change Lights</button>
          </p>
        </form>
      </div>
    );
    const lightsLogin = (
      <OauthSender
        authorizeUrl="https://api.meethue.com/oauth2/auth"
        clientId={kGlobalConstants.HUE_CLIENT_ID}
        redirectUri=""
        state={{ from: '/settings' }}
        args={{
          appid: kGlobalConstants.HUE_APP_ID,
          deviceid: kGlobalConstants.HUE_DEVICE_ID,
          state: uuid(),
          response_type: 'code'
        }}
        render={({ url }) => (
          <a className="login-button" href={url}>Connect to Hue</a>
        )}
      />
    );
    return (
      <div>
        <h3>Lights</h3>
        <div className="lights">
          <p>Change the color and brightness of the lights in the room</p>
          { loggedIn ? lightsForm : lightsLogin }
        </div>
      </div>
    );
  }
}
export default Lights;

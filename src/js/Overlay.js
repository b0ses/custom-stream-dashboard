import React, { Component } from 'react';
import PropTypes from 'prop-types';

const kGlobalConstants = require('./Settings').default;

class Overlay extends Component {
  constructor() {
    super();

    this.state = {
      live: true,
      editTag: null
    };

    this.setMode = this.setMode.bind(this);
  }

  setMode(event) {
    const {
      target: {
        checked
      }
    } = event;

    this.setState({
      live: checked
    })

    kGlobalConstants.LIVE = checked;
  }

  render () {
    const { live } = this.state;

    let server = `${kGlobalConstants.API_HOST}`;
    if (!live) {
      server = `${server}:${kGlobalConstants.PREVIEW_PORT}`
    }

    return (
      <div className="real-time-overlay">
        <h3>The Soundboard</h3>
        <p>
          To install, add a BrowserSource to OBS with the url below and Interact to click the button.<br />
          Use the toggle to switch between hitting the preview url for testing or the live url. <br />
          (note: toggle applies this whole page, not just the overlay url.)
        </p>
        <div>
          <div className="url-switch">
            <span className="url-switch-option">Preview</span>
            <label className="switch">
              <input type="checkbox" onChange={this.setMode} defaultChecked />
              <span className="slider round"></span>
            </label>
            <span className="url-switch-option">Live</span>
          </div>
        </div>
            <div>
              <p>
                URL:&nbsp;
                <a href={server} target="_blank" rel="noopener noreferrer">{server}</a>
              </p>
              <iframe id="overlay-iframe" title="overlay-iframe" src={server} height="50" scrolling="no" />
            </div>
      </div>
    );
  }
}

export default Overlay;

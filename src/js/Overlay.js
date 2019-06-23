import React from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';

const kGlobalConstants = require('./Settings').default;

export default function Overlay() {
  const server = `${kGlobalConstants.API_HOST}/`;

  return (
    <div>
      <ScrollableAnchor id="real-time-overlay">
        <h3>Real-time Overlay</h3>
      </ScrollableAnchor>
      <div className="real-time-overlay">
        <p>
          URL (for OBS BrowserSource):
          <a href={server} target="_blank" rel="noopener noreferrer">{server}</a>
        </p>
        <iframe id="overlay-iframe" title="overlay-iframe" src={server} height="50" width="500" scrolling="no" />
      </div>
    </div>
  );
}
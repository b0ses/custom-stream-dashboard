import React from 'react';

import Alerts from './Alerts';
import GroupAlerts from './GroupAlerts';
import Overlay from './Overlay';

const App = () => (
  <div>
    <Overlay />
    <GroupAlerts />
    <Alerts />
  </div>
);

export default App;

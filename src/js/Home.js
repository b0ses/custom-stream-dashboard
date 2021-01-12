import React from 'react';

import UserDetails from './UserDetails';
import Overlay from './Overlay';
import GroupAlerts from './GroupAlerts';
import Alerts from './Alerts';
import Lights from './Lights';

const Home = () => (
  <div>
    <UserDetails />
    <Overlay />
    <GroupAlerts />
    <Alerts />
    <Lights />
  </div>
);

export default Home;

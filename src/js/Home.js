import React from 'react';

import UserDetails from './UserDetails';
import Overlay from './Overlay';
import GroupAlerts from './GroupAlerts';
import Alerts from './Alerts';

const Home = () => (
  <div>
    <UserDetails />
    <Overlay />
    <GroupAlerts />
    <Alerts />
  </div>
);

export default Home;

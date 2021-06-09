import React from 'react';
import { Route, Switch, HashRouter } from "react-router-dom";

import SignUp from './user/Sign-up';
import Login from './user/Login'

import '../node_modules/antd/dist/antd.css';

const App = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/login" component={Login} />
      <Route component={Login} />
    </Switch>
  </HashRouter>
);

export default App;
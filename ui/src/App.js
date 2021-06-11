import React from 'react';
import { Route, Switch, HashRouter } from "react-router-dom";

import SignUp from './user/Sign-up';
import Login from './user/Login'

import '../node_modules/antd/dist/antd.css';

const UserContext = React.createContext({
  // User Info goes here once login success
});

const App = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/signup" component={SignUp} />
      <Route path="/userInfo/:id" component={SignUp} />
      <Route exact path="/login" component={Login} />
      <Route component={Login} />
    </Switch>
  </HashRouter>
);

export default App;
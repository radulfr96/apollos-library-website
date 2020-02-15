/* eslint-disable max-len */
import * as React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Route, Switch, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AppContext } from '../Context';
import NavMenu from './Navigation/NavMenu';
import MyAccount from '../pages/User/MyAccount/MyAccount';
import { MyDetails } from '../pages/User/MyAccount/MyDetails';
import Login from '../pages/User/Login';
import Home from '../pages/Home';
import Users from '../pages/User/Users';
import { Register } from '../pages/User/Register';

const useStyles = makeStyles(({
  root: {
    padding: '20px',
  },
}));

export default function Layout() {
  const classes = useStyles();
  const history = createBrowserHistory();

  return (
    <AppContext.Consumer>
      {() => (
        <>
          <NavMenu />
          <Grid container className={classes.root}>
            <Router history={history}>
              <Switch>
                <Route exact path={['/details', '/password']}>
                  <MyAccount>
                    <Switch>
                      <Route path="/details" component={MyDetails} />
                    </Switch>
                  </MyAccount>
                </Route>
                <Route path="/user" component={Users} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/" component={Home} />
              </Switch>
            </Router>
          </Grid>
        </>
      )}
    </AppContext.Consumer>
  );
}

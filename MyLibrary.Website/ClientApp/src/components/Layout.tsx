import * as React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from '../Context';
import NavMenu from './Navigation/NavMenu';

const useStyles = makeStyles(({
  root: {
    padding: '20px',
  },
}));

export default function Layout(props: { children?: React.ReactNode }) {
  const classes = useStyles();
  return (
    <AppContext.Consumer>

      {(context) => (
        <>
          <NavMenu />
          <Grid container className={classes.root}>
            {props.children}
          </Grid>
        </>
      )}
    </AppContext.Consumer>
  )
};

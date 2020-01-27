import * as React from 'react';
import NavMenu from './NavMenu';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from '../Context'

const useStyles = makeStyles(theme => ({
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

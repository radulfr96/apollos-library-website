import * as React from 'react';
import NavMenu from './NavMenu';
import { ThemeProvider, Grid } from '@material-ui/core';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '20px',
  },
}));

export default function Layout(props: { children?: React.ReactNode }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <NavMenu />
      <Grid container justify='center' className={classes.root}>
        {props.children}
      </Grid>
    </React.Fragment>
  )
};

import * as React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import { ThemeProvider } from '@material-ui/core';
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
      <Container className={classes.root}>
        {props.children}
      </Container>
    </React.Fragment>
  )
};

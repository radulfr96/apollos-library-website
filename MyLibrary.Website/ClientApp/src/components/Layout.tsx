import * as React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#8C2938'
    },
    secondary: {
      main: '#BFA5A5'
    },
  },
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: '20px',
  },
}));

export default function Layout(props: { children?: React.ReactNode }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <NavMenu />
        <Container className={classes.root}>
          {props.children}
        </Container>
      </ThemeProvider>
    </React.Fragment>
  )
};

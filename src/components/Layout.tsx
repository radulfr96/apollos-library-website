/* eslint-disable max-len */
import * as React from 'react';
import { Grid } from '@mui/material';
import { AppContext } from '../Context';
import NavMenu from './navigation/NavMenu';

export default function Layout(props: { children: React.ReactNode | undefined }): JSX.Element {
  return (
    <AppContext.Consumer>
      {() => (
        <>
          <NavMenu />
          <Grid container sx={{ padding: '20px' }}>
            {props.children}
          </Grid>
        </>
      )}
    </AppContext.Consumer>
  );
}

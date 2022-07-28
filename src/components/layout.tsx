/* eslint-disable max-len */
import * as React from 'react';
import { Grid } from '@mui/material';
import { AppContext } from '../userContext';
import NavMenu from './navigation/navMenu';
import Footer from './footer';

const Layout = (props: { children?: React.ReactNode }) => {
    const { children } = props;

    return (
        <AppContext.Consumer>
            {() => (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <NavMenu />
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        {children}
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={12}>
                        <Footer />
                    </Grid>
                </Grid>
            )}
        </AppContext.Consumer>
    );
};

export default Layout;

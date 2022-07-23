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
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <NavMenu />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {children}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Footer />
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </AppContext.Consumer>
    );
};

export default Layout;

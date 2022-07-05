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
                <>
                    <NavMenu />
                    <Grid container sx={{ padding: '20px' }}>
                        {children}
                    </Grid>
                    <Footer />
                </>
            )}
        </AppContext.Consumer>
    );
};

export default Layout;

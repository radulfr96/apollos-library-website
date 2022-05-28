/* eslint-disable max-len */
import * as React from 'react';
import { Grid } from '@mui/material';
import { AppContext } from '../context';
import NavMenu from './navigation/NavMenu';

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
                </>
            )}
        </AppContext.Consumer>
    );
};

export default Layout;

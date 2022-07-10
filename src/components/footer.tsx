import React from 'react';
import {
    AppBar, Grid, Link, Toolbar, Typography,
} from '@mui/material';

const Footer = () => (
    <AppBar
        position="fixed"
        color="secondary"
        sx={{
            top: 'auto', bottom: 0,
        }}
    >
        <Toolbar>
            <Grid container spacing={2}>
                <Grid item xs={2} />
                <Grid item xs={3} textAlign="left">
                    <Typography>
                        &copy; Apollo&apos;s Library 2022
                    </Typography>
                </Grid>
                <Grid item xs={2} textAlign="center">
                    <Typography>
                        <Link href="https://www.iubenda.com/terms-and-conditions/86495681" sx={{ color: '#FFFFFF' }}>Terms and Conditions</Link>
                    </Typography>
                    <Typography>
                        <Link href="https://www.iubenda.com/privacy-policy/86495681" target="_blank" sx={{ color: '#FFFFFF' }}>Privacy Policy</Link>
                    </Typography>
                </Grid>
                <Grid item xs={3} textAlign="right">
                    <Typography>
                        ABN: 25 338 116 207
                    </Typography>
                </Grid>
                <Grid item xs={2} />
            </Grid>
        </Toolbar>
    </AppBar>
);

export default Footer;

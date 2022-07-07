import React from 'react';
import { Grid, Link, Typography } from '@mui/material';

const Footer = () => (
    <Grid
        sx={{
            position: 'fixed', bottom: 0, padding: '20px',
        }}
        component="footer"
        container
    >
        <Grid item xs={2} />
        <Grid item xs={3} textAlign="left">
            <Typography>
                &copy; Apollo&apos;s Library 2022
            </Typography>
        </Grid>
        <Grid item xs={2} textAlign="center">
            <Typography>
                <Link href="https://www.iubenda.com/terms-and-conditions/86495681" sx={{ textDecoration: 'none', color: '#000000' }}>Terms and Conditions</Link>
            </Typography>
            <Typography>
                <Link href="https://www.iubenda.com/privacy-policy/86495681" target="_blank" sx={{ textDecoration: 'none', color: '#000000' }}>Privacy Policy</Link>
            </Typography>
        </Grid>
        <Grid item xs={3} textAlign="right">
            <Typography>
                ABN: 25 338 116 207
            </Typography>
        </Grid>
        <Grid item xs={2} />
    </Grid>
);

export default Footer;

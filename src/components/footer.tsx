import { Grid, Link, Typography } from '@mui/material';
import React from 'react';

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
                <Link href="./" sx={{ textDecoration: 'none', color: '#000000' }}>Terms and Conditions</Link>
            </Typography>
            <Typography>
                <Link href="./" sx={{ textDecoration: 'none', color: '#000000' }}>Privacy Policy</Link>
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

import * as React from 'react';
import { Typography, Grid } from '@mui/material';

const Home = () => (
    <Grid item container xs={12}>
        <Grid item xs={12}>
            <Typography variant="h4">
                Welcome to Apollo&apos;s Library
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>
                Apollo&apos;s Library is a site where book lovers
                can keep track of their own personal library.
                They will also be able to keep track of their purchase history in order to adjust
                their book spending budget as much as needed.
            </Typography>
        </Grid>
    </Grid>
);

export default Home;

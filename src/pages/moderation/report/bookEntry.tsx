import { Grid, Typography } from '@mui/material';
import React from 'react';

const BookEntry = () => (
    <Grid item xs={12}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">
                    Book Entry Details
                </Typography>
            </Grid>
        </Grid>
    </Grid>
);

export default BookEntry;

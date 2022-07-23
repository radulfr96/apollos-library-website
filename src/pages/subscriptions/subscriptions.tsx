import React from 'react';
import { Grid } from '@mui/material';
import PageHeading from '../../components/shared/pageHeading';
import ProductDisplay from '../../components/subscription/productDisplay';

const Subscriptions = () => (
    <Grid item xs={12}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <PageHeading headingText="Subscriptions" />
            </Grid>
            <Grid item xs={4}>
                <ProductDisplay />
            </Grid>
        </Grid>
    </Grid>
);

export default Subscriptions;

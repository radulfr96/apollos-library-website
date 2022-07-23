import { Grid } from '@mui/material';
import React from 'react';
import PageHeading from '../../../components/shared/pageHeading';

const BudgetSettings = () => (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <PageHeading headingText="Budget Settings" />
        </Grid>
    </Grid>
);

export default BudgetSettings;

import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { Book } from '@mui/icons-material';
import {
    Button, CircularProgress, Grid, Typography,
} from '@mui/material';
import { AppContext } from '../../userContext';
import ConfigHelper from '../../config/configHelper';

interface SubscriptionSuccessProps {
    sessionId: string | null;
}

const SubscriptionSuccess = (props: SubscriptionSuccessProps) => {
    const { sessionId } = props;
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        setIsLoading(false);
    }, [context]);

    const manageSubscription = () => {
        Axios.post(`${configHelper.apiUrl}/api/subscription/create-portal-session`, { sessionId }, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((result: any) => {
                window.location.href = result.data.portalURL;
            });
    };

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={6}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Book />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        Subscription to plan successful! Welcome to Apollo&apos;s Library
                    </Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button
                        id="checkout-and-portal-button"
                        color="primary"
                        variant="contained"
                        onClick={() => manageSubscription()}
                    >
                        Manage your billing information
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SubscriptionSuccess;

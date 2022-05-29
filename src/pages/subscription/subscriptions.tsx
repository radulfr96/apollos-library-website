import React, { useContext, useEffect, useState } from 'react';
import {
    Button, Card, CardActions, CardContent, CircularProgress, Grid, Typography,
} from '@mui/material';
import { Book } from '@mui/icons-material';
import Axios from 'axios';
import { AppContext } from '../../context';
import SubscriptionOption from '../../interfaces/subscriptionOption';
import ConfigHelper from '../../config/configHelper';
import PageHeading from '../../components/shared/pageHeading';

interface SubscriptionsState {
    subscriptions: SubscriptionOption[];
}

const ProductDisplay = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const [subscriptionsState, setSubscriptionsState] = useState<SubscriptionsState>({
        subscriptions: [],
    });

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        Axios.get(`${configHelper.apiUrl}/api/subscription`)
            .then((response: any) => {
                setSubscriptionsState({
                    subscriptions: response.data.subscriptionTypes,
                });
                setIsLoading(false);
            });
    }, [context]);

    const submit = ((productId: string) => {
        Axios.post(`${configHelper.apiUrl}/api/subscription/create-checkout-session`, { productId }, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
                ContentType: 'application/json',
            },
        })
            .then((result: any) => {
                window.location.href = result.data.checkoutURL;
            });
    });

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={12}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <PageHeading headingText="Subscriptions" />
                </Grid>
                <Grid item xs={4}>
                    <Grid container spacing={2}>
                        {
                            subscriptionsState.subscriptions.map((subscriptionOption) => (
                                <Grid item xs={6} key={subscriptionOption.subscriptionType}>
                                    <Card>
                                        <CardContent className="product" sx={{ height: '250px' }}>
                                            <Book />
                                            <br />
                                            <Typography variant="h4">{subscriptionOption.subscriptionName}</Typography>
                                            <Typography variant="h5">
                                                $
                                                {subscriptionOption.cost}
                                                {' '}
                                                / month
                                            </Typography>
                                            <br />
                                            <Typography variant="body1">
                                                {subscriptionOption.description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    width: '100%',
                                                }}
                                                onClick={() => {
                                                    submit(subscriptionOption.priceId);
                                                }}
                                            >
                                                Select
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ProductDisplay;

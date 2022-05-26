import { Button, CircularProgress, Grid } from '@mui/material';
import { Formik } from 'formik';
import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import InputTextField from '../../components/shared/InputTextField';
import PageHeading from '../../components/shared/PageHeading';
import { AppContext } from '../../Context';

interface SubscriptionCheckoutParams {
    priceId: string;
}

const SubscriptionCheckout = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const context = useContext(AppContext);
    const params = useParams<SubscriptionCheckoutParams>();
    const { priceId } = params;

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }
        setIsLoading(false);
    }, [context]);

    const submit = (() => {
        Axios.post('/create-checkout-session', {
            priceId,
        });
    });

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={8} container justifyContent="center">
            <Grid item xs={12}>
                <PageHeading headingText="Orders" />
            </Grid>
            <Grid item xs={12}>
                <Formik
                    initialValues={{
                        priceId: '',
                    }}
                    onSubmit={() => { }}
                >
                    {() => (
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <InputTextField type="hidden" keyName="priceId" value={priceId} />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Button onClick={() => submit()}>Checkout</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Formik>
            </Grid>
        </Grid>
    );
};

export default SubscriptionCheckout;

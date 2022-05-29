import { Add } from '@mui/icons-material';
import { CircularProgress, Fab, Grid } from '@mui/material';
import Axios from 'axios';
import { push } from 'connected-react-router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import OrdersTable from '../../components/ordersTable';
import PageHeading from '../../components/shared/pageHeading';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../context';
import OrderListItem from '../../interfaces/orderListItem';

interface OrdersState {
    orders: Array<OrderListItem>;
}

const Orders = () => {
    const [ordersState, setOrdersState] = useState<OrdersState>({
        orders: [],
    });

    const [isLoading, setIsLoading] = useState<boolean>();
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();
    const store = useStore();

    const renderErrorSnackbar = (message: string): void => {
        enqueueSnackbar(message, {
            variant: 'error',
        });
    };

    const renderSuccessSnackbar = (message: string): void => {
        enqueueSnackbar(message, {
            variant: 'success',
        });
    };

    const getOrders = () => new Promise<void>((resovle) => {
        Axios.get(`${configHelper.apiUrl}/api/order`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setOrdersState({ ...ordersState, orders: response.data.orders });
                resovle();
            });
    });

    const deleteOrder = (id: number): void => {
        Axios.delete(`${configHelper.apiUrl}/api/order/${id}`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Delete successful');
                    getOrders();
                }
            })
            .catch(() => {
                renderErrorSnackbar('Unable to delete order please contact admin');
            });
    };

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }
        getOrders()
            .then(() => {
                setIsLoading(false);
            });
    }, [context]);

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={8} container justifyContent="center">
            <Grid item xs={12}>
                <PageHeading headingText="Orders" />
            </Grid>
            {
                context.isAdmin() && (
                    <Grid item xs={12}>
                        <OrdersTable
                            orders={ordersState.orders}
                            deleteOrder={deleteOrder}
                        />
                    </Grid>
                )
            }

            <Grid item xs={12}>
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        marginTop: '10px',
                        float: 'right',
                    }}
                    onClick={() => {
                        store.dispatch(push('/addorder'));
                    }}
                >
                    <Add />
                </Fab>
            </Grid>
        </Grid>
    );
};

export default Orders;

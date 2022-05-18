import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import {
    Button, CircularProgress, Grid,
} from '@mui/material';
import { push } from 'connected-react-router';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useStore } from 'react-redux';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../Context';
import Order from '../../interfaces/order';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';
import Typedown from '../../components/shared/Typedown';
import TypedownOption from '../../interfaces/typedownOption';
import BusinessListItem from '../../interfaces/businessListItem';
import Book from '../../interfaces/book';
import DateSelector from '../../components/shared/DatePicker';

interface OrderParams {
    id?: string;
}

interface OrderState {
    businesses: BusinessListItem[];
    books: Book[];
    order: Order;
    newOrder: boolean;
}

const OrderPage = () => {
    const [orderState, setOrderState] = useState<OrderState>({
        businesses: [],
        books: [],
        order: {
            orderId: 0,
            bookshopId: 0,
            orderDate: new Date(),
            orderItems: [],
        },
        newOrder: false,
    });
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams<OrderParams>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const store = useStore();

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        Axios.get(`${configHelper.apiUrl}/api/business`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (params.id !== undefined && params.id !== null) {
                    Axios.get(`${configHelper.apiUrl}/api/order/${params.id}`, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((orderResponse) => {
                            setOrderState({
                                businesses: response.data.businesses,
                                books: [],
                                order: orderResponse.data,
                                newOrder: false,
                            });
                            setIsLoading(false);
                        });
                } else {
                    setOrderState({
                        ...orderState,
                        newOrder: true,
                        businesses: response.data.businesses,
                    });
                    setIsLoading(false);
                }
            });
    }, [context]);

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

    const renderWarningSnackbar = (message: string): void => {
        enqueueSnackbar(message, {
            variant: 'warning',
        });
    };

    const updateOrder = (order: Order, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.put(`${configHelper.apiUrl}/api/order/`, order, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update successful');
                                store.dispatch(push('/orders'));
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to update order invalid input');
                            } else {
                                renderErrorSnackbar('Unable to update order please contact admin');
                            }
                        });
                }
            });
    };

    const addOrder = (order: Order, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post(`${configHelper.apiUrl}/api/order/`, order, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Add successful');
                                store.dispatch(push('/orders'));
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to add order invalid input');
                            } else {
                                renderErrorSnackbar('Unable to add order please contact admin');
                            }
                        });
                }
            });
    };

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <>
            <Grid item xs={12}>
                {
                    !orderState.newOrder && (
                        <PageHeading headingText="Order Details" />
                    )
                }
                {
                    orderState.newOrder && (
                        <PageHeading headingText="New Order" />
                    )
                }
            </Grid>
            <Formik
                initialValues={orderState.order}
                onSubmit={() => { }}
                validationSchema={
                    yup.object().shape({
                        dateOrder: yup.date()
                            .required('An order must have a date'),
                    })
                }
            >
                {({
                    values,
                    errors,
                    handleChange,
                    validateForm,
                    setFieldValue,
                }) => (
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Grid container spacing={2}>
                                    {
                                        !orderState.newOrder && (
                                            <Grid item xs={12}>
                                                <InputTextField
                                                    label="Order Id"
                                                    required
                                                    type="text"
                                                    keyName="orderId"
                                                    value={values.orderId}
                                                    onChange={handleChange}
                                                    error={!!(errors.orderId)}
                                                    errorMessage={errors.orderId}
                                                    readonly
                                                />
                                            </Grid>
                                        )
                                    }

                                    <Grid item xs={12}>
                                        <Typedown
                                            label="Business"
                                            id="businessId"
                                            options={
                                                orderState.businesses.map<TypedownOption>((business) => ({
                                                    value: business.businessId,
                                                    name: `${business.name} (${business.country})`,
                                                } as TypedownOption))
                                            }
                                            value={values.bookshopId?.toString()}
                                            updateSelection={(selected?: number | string) => {
                                                if (selected !== undefined) {
                                                    setFieldValue('businessId', selected);
                                                    setOrderState({
                                                        ...orderState,
                                                        order: {
                                                            ...orderState.order,
                                                            bookshopId: selected as number,
                                                        },
                                                    });
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <DateSelector
                                            label="Order Date"
                                            value={values.orderDate}
                                            keyName="orderDate"
                                            required
                                            onChange={(selected: Date) => {
                                                setFieldValue('orderDate', selected);
                                            }}
                                            errorMessage="Order must have a date"
                                            error={!!(errors.orderDate)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
                                        {!orderState.newOrder && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (errors !== null) {
                                                        updateOrder(values, validateForm);
                                                    }
                                                }}
                                            >
                                                Update
                                            </Button>
                                        )}
                                        {orderState.newOrder && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (errors !== null) {
                                                        addOrder(values, validateForm);
                                                    }
                                                }}
                                            >
                                                Add
                                            </Button>
                                        )}

                                        <Button
                                            sx={{ marginLeft: '10px' }}
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                store.dispatch(push('/orders'));
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Formik>
        </>
    );
};

export default OrderPage;

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
import { AppContext } from '../../context';
import Order from '../../interfaces/order';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';
import Typedown from '../../components/shared/Typedown';
import TypedownOption from '../../interfaces/typedownOption';
import BusinessListItem from '../../interfaces/businessListItem';
import DateSelector from '../../components/shared/DatePicker';
import OrderLineItemsTable from '../../components/OrderLineItemsTable';
import LibraryBook from '../../interfaces/libraryBook';

interface OrderParams {
    id?: string;
}

interface OrderState {
    businesses: BusinessListItem[];
    books: LibraryBook[];
    order: Order;
    newOrder: boolean;
}

const OrderPage = () => {
    const [orderState, setOrderState] = useState<OrderState>({
        businesses: [],
        books: [],
        order: {
            orderId: 0,
            businessId: 0,
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

        const requests = [];

        requests.push(Axios.get(`${configHelper.apiUrl}/api/business/bookshops`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        requests.push(Axios.get(`${configHelper.apiUrl}/api/library/books`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        Promise.allSettled(requests).then((responses: Array<any>) => {
            if (params.id !== undefined && params.id !== null) {
                Axios.get(`${configHelper.apiUrl}/api/order/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${context.getToken()}`,
                    },
                })
                    .then((orderResponse) => {
                        setOrderState({
                            ...orderState,
                            businesses: responses[0].value.data.businesses,
                            books: responses[1].value.data.libraryBooks,
                            order: orderResponse.data,
                            newOrder: false,
                        });
                        setIsLoading(false);
                    });
            } else {
                setOrderState({
                    ...orderState,
                    businesses: responses[0].data,
                    books: responses[1].data,
                    newOrder: true,
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

    const updateOrder = (validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.put(`${configHelper.apiUrl}/api/order/`, orderState.order, {
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

    const addOrder = (validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post(`${configHelper.apiUrl}/api/order/`, orderState.order, {
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

    const addOrderItem = (orderItem: any, validateForm: any) => new Promise<void>((resolve) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    const book = orderState.books.find((b) => b.bookId === orderItem.bookId);
                    if (book) {
                        setOrderState({
                            ...orderState,
                            order: {
                                ...orderState.order,
                                orderItems: [...orderState.order.orderItems, {
                                    bookId: book.bookId,
                                    title: book.title,
                                    isbn: book.isbn,
                                    eisbn: book.eisbn,
                                    quantity: orderItem.quantity,
                                    unitPrice: orderItem.unitPrice,
                                    total: orderItem.quantity * orderItem.unitPrice,
                                }],
                            },
                        });
                        resolve();
                    }
                }
            });
    });

    const getIsbnString = (book: LibraryBook) => {
        let section = '';

        if (book.isbn) {
            section = `${book.isbn} - `;
        } else if (book.eisbn) {
            section = `${book.isbn} - `;
        }

        return section;
    };

    const orderFormInitialValues = {
        bookId: undefined,
        quantity: undefined,
        unitPrice: undefined,
    };

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={12}>
            <Grid container spacing={2}>
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
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Formik
                                initialValues={orderState.order}
                                onSubmit={() => { }}
                                validationSchema={
                                    yup.object().shape({
                                        orderDate: yup.date()
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
                                                    label="Bookshop"
                                                    id="businessId"
                                                    options={
                                                        orderState.businesses.map<TypedownOption>((business) => ({
                                                            value: business.businessId,
                                                            name: `${business.name} (${business.country})`,
                                                        } as TypedownOption))
                                                    }
                                                    value={values.businessId}
                                                    updateSelection={(selected?: number | string) => {
                                                        if (selected !== undefined) {
                                                            setFieldValue('businessId', selected);
                                                            setOrderState({
                                                                ...orderState,
                                                                order: {
                                                                    ...orderState.order,
                                                                    businessId: selected as number,
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
                                                                updateOrder(validateForm);
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
                                                                addOrder(validateForm);
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
                                )}
                            </Formik>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Formik
                                        initialValues={orderFormInitialValues}
                                        onSubmit={() => { }}
                                        validationSchema={
                                            yup.object().shape({
                                                bookId: yup.number()
                                                    .required('You must select a book.'),
                                            })
                                        }
                                    >
                                        {({
                                            values,
                                            errors,
                                            handleChange,
                                            validateForm,
                                            setFieldValue,
                                            handleSubmit,
                                        }) => (
                                            <Grid item xs={12}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={7}>
                                                        <Typedown
                                                            label="Book"
                                                            id="bookId"
                                                            options={orderState.books.filter((b) => orderState.order.orderItems.map((i) => i.bookId).includes(b.bookId) === false).map<TypedownOption>((book) => ({
                                                                value: book.bookId,
                                                                name: `${getIsbnString(book)} ${book.title} (${book.author})`,
                                                            } as TypedownOption))}
                                                            value={values.bookId}
                                                            updateSelection={(selected?: number | string) => {
                                                                if (selected !== undefined) {
                                                                    setFieldValue('bookId', selected);
                                                                }
                                                            }}
                                                            error={!!(errors.bookId)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <InputTextField
                                                            label="Quantity"
                                                            keyName="quantity"
                                                            type="number"
                                                            value={values.quantity}
                                                            error={!!(errors.quantity)}
                                                            onChange={handleChange}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <InputTextField
                                                            label="Unit Price"
                                                            keyName="unitPrice"
                                                            type="number"
                                                            value={values.unitPrice}
                                                            error={!!(errors.unitPrice)}
                                                            onChange={handleChange}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{
                                                                height: '100%',
                                                                width: '100%',
                                                            }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                addOrderItem(values, validateForm)
                                                                    .then(() => { })
                                                                    .catch((err: any) => {
                                                                        console.log(err);
                                                                    });
                                                                handleSubmit();
                                                            }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Formik>
                                </Grid>
                                <Grid item xs={12}>
                                    <OrderLineItemsTable
                                        orderItems={orderState.order.orderItems}
                                        deleteOrderItem={(bookId: number) => {
                                            const filteredList = orderState.order.orderItems.filter((i) => i.bookId !== bookId);
                                            setOrderState({
                                                ...orderState,
                                                order: {
                                                    ...orderState.order,
                                                    orderItems: filteredList,
                                                },
                                            });
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default OrderPage;

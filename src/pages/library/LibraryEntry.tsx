import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { push } from 'connected-react-router';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, CircularProgress, Grid } from '@mui/material';
import { useStore } from 'react-redux';
import { useParams } from 'react-router';
import Typedown from '../../components/shared/Typedown';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../Context';
import LibraryEntry from '../../interfaces/libraryEntry';
import BookListItem from '../../interfaces/bookListItem';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';
import TypedownOption from '../../interfaces/typedownOption';

interface LibraryEntryParams {
    id: string;
}

interface LibraryEntryState {
    books: BookListItem[],
    entry: LibraryEntry,
    newEntry: boolean
}

const LibraryEntryPage = () => {
    const [entryState, setEntryState] = useState<LibraryEntryState>({
        books: [],
        entry: {
            entryId: 0,
            bookId: undefined,
            quantity: 0,
        },
        newEntry: false,
    });

    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const store = useStore();
    const { id } = useParams<LibraryEntryParams>();

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        Axios.get(`${configHelper.apiUrl}/api/book`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (id !== undefined && id !== null) {
                    Axios.get(`${configHelper.apiUrl}/api/library/entry/${id}`, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((entryResponse) => {
                            setEntryState({
                                ...entryState,
                                entry: entryResponse.data,
                                newEntry: false,
                                books: response.data.books,
                            });
                            setIsLoading(false);
                        });
                } else {
                    setEntryState({
                        ...entryState,
                        newEntry: true,
                        books: response.data.books,
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

    const updateEntry = (entry: LibraryEntry, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch(`${configHelper.apiUrl}/api/library/`, entry, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update successful');
                                store.dispatch(push('/library'));
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to update entry invalid input');
                            } else {
                                renderErrorSnackbar('Unable to update entry please contact admin');
                            }
                        });
                }
            });
    };

    const addEntry = (entry: LibraryEntry, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post(`${configHelper.apiUrl}/api/library/addentry`, entry, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Add successful');
                                store.dispatch(push('/library'));
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to add entry invalid input');
                            } else {
                                renderErrorSnackbar('Unable to add entry please contact admin');
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
                    !entryState.newEntry && (
                        <PageHeading headingText="Entry Details" />
                    )
                }
                {
                    entryState.newEntry && (
                        <PageHeading headingText="New Entry" />
                    )
                }
            </Grid>
            <Formik
                initialValues={entryState.entry}
                onSubmit={() => { }}
                validationSchema={
                    yup.object().shape({
                        quantity: yup.number()
                            .min(1, 'Entry must have quantity of at least 1'),
                        bookId: yup.number()
                            .required('Entry must have a book'),
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
                                        !entryState.newEntry && (
                                            <Grid item xs={12}>
                                                <InputTextField
                                                    label="Entry Id"
                                                    required
                                                    type="text"
                                                    keyName="entryId"
                                                    value={values.entryId}
                                                    onChange={handleChange}
                                                    error={!!(errors.entryId)}
                                                    errorMessage={errors.entryId}
                                                    readonly
                                                />
                                            </Grid>
                                        )
                                    }

                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Quantity"
                                            required
                                            type="number"
                                            keyName="quantity"
                                            value={values.quantity}
                                            onChange={handleChange}
                                            error={!!(errors.quantity)}
                                            errorMessage={errors.quantity}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typedown
                                            label="Book"
                                            id="bookId"
                                            options={
                                                entryState.books.map<TypedownOption>((book) => ({
                                                    value: book.bookId,
                                                    name: `${book.title} ${book.isbn ? '' : `${(book.isbn)}`}`,
                                                } as TypedownOption))
                                            }
                                            value={values.bookId}
                                            updateSelection={(selected?: number | string) => {
                                                if (selected !== undefined) {
                                                    setFieldValue('bookId', selected);
                                                    setEntryState({
                                                        ...entryState,
                                                        entry: {
                                                            ...entryState.entry,
                                                            bookId: selected as number,
                                                        },
                                                    });
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
                                        {!entryState.newEntry && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (errors !== null) {
                                                        updateEntry(values, validateForm);
                                                    }
                                                }}
                                            >
                                                Update
                                            </Button>
                                        )}
                                        {entryState.newEntry && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (errors !== null) {
                                                        addEntry(values, validateForm);
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
                                                store.dispatch(push('/library'));
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

export default LibraryEntryPage;

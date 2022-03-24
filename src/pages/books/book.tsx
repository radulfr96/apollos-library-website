import { useParams } from 'react-router';
import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import { CircularProgress, Grid, Button } from '@mui/material';
import { push } from 'connected-react-router';
import { useStore } from 'react-redux';
import { useSnackbar } from 'notistack';
import { PublisherListItem } from '../../interfaces/publisherListItem';
import { AuthorListItem } from '../../interfaces/authorListItem';
import { Genre } from '../../interfaces/genre';
import PublicationFormat from '../../interfaces/publicationFormat';
import FormType from '../../interfaces/formType';
import FictionType from '../../interfaces/fictionType';
import Book from '../../interfaces/book';
import { AppContext } from '../../Context';
import ConfigHelper from '../../config/configHelper';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';
import ChipSelector from '../../components/shared/ChipSelector';
import ChipOption from '../../interfaces/chipOption';

interface BookParams {
    id: string;
}

interface BookState {
    publishers: PublisherListItem[];
    authors: AuthorListItem[];
    publicationFormats: PublicationFormat[];
    formTypes: FormType[];
    fictionTypes: FictionType[];
    genres: Genre[];
    book: Book;
    newBook: boolean;
}

const BookPage = () => {
    const [bookState, setBookState] = useState<BookState>({
        publishers: [],
        authors: [],
        publicationFormats: [],
        formTypes: [],
        fictionTypes: [],
        genres: [],
        book: {
            bookID: 0,
            isbn: '',
            eisbn: '',
            title: '',
            subtitle: '',
            seriesID: undefined,
            numberInSeries: undefined,
            edition: 0,
            publicationFormatID: 0,
            fictionTypeID: 0,
            formTypeID: 0,
            publisherID: undefined,
            coverImage: undefined,
            genres: [],
            authors: [],
        },
        newBook: false,
    });

    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const { id } = useParams<BookParams>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const store = useStore();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        const requests = [];

        requests.push(Axios.get(`${configHelper.apiUrl}/api/reference/bookReferenceData`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        requests.push(Axios.get(`${configHelper.apiUrl}/api/author`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        requests.push(Axios.get(`${configHelper.apiUrl}/api/publisher`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        requests.push(Axios.get(`${configHelper.apiUrl}/api/genre`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        Promise.allSettled(requests).then((responses: Array<any>) => {
            if (id !== undefined && id !== null) {
                Axios.get(`${configHelper.apiUrl}/api/book/${id}`, {
                    headers: {
                        Authorization: `Bearer ${context.getToken()}`,
                    },
                })
                    .then((booksResponse) => {
                        setBookState({
                            ...bookState,
                            publicationFormats: responses[0].value.data.publicationFormats,
                            formTypes: responses[0].value.data.formTypes,
                            fictionTypes: responses[0].value.data.fictionTypes,
                            authors: responses[1].value.data.authors,
                            publishers: responses[2].value.data.publishers,
                            genres: responses[3].value.data.genres,
                            newBook: false,
                            book: booksResponse.data,
                        });
                        setIsLoading(false);
                    });
            } else {
                setBookState({
                    ...bookState,
                    publicationFormats: responses[0].value.data.publicationFormats,
                    formTypes: responses[0].value.data.formTypes,
                    fictionTypes: responses[0].value.data.fictionTypes,
                    authors: responses[1].value.data.authors,
                    publishers: responses[2].value.data.publishers,
                    genres: responses[3].value.data.genres,
                    newBook: true,
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

    const updateBook = (book: Book, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch(`${configHelper.apiUrl}/api/book`, book, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update successful');
                                store.dispatch(push('/books'));
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to update author invalid input');
                            } else {
                                renderErrorSnackbar('Unable to update author please contact admin');
                            }
                        });
                }
            });
    };

    const addBook = (book: Book, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post(`${configHelper.apiUrl}/api/book`, book, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Add successful');
                                store.dispatch(push('/books'));
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to add author, invalid input');
                            } else {
                                renderErrorSnackbar('Unable to add author please contact admin');
                            }
                        });
                }
            });
    };

    if ((!bookState.newBook && bookState.book.bookID !== undefined) || isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={6} container justifyContent="center">
            <Grid item xs={12}>
                {
                    !bookState.newBook && (
                        <PageHeading headingText="Book Details" />
                    )
                }
                {
                    bookState.newBook && (
                        <PageHeading headingText="New Book" />
                    )
                }
            </Grid>
            <Grid item xs={12}>
                <Formik
                    initialValues={bookState.book}
                    onSubmit={() => { }}
                    validationSchema={
                        yup.object().shape({
                            firstname: yup.string()
                                .required('An author must have a firstname or alias'),
                        })
                    }
                >
                    {({
                        values,
                        errors,
                        handleChange,
                        validateForm,
                    }) => (
                        <Grid container item xs={12}>

                            {
                                !bookState.newBook && (
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Book ID"
                                            required
                                            type="text"
                                            keyName="bookID"
                                            value={values.bookID}
                                            onChange={handleChange}
                                            error={!!(errors.bookID)}
                                            errorMessage={errors.bookID}
                                            readonly
                                        />
                                    </Grid>
                                )
                            }

                            <Grid item xs={12}>
                                <InputTextField
                                    label="Title"
                                    required
                                    type="text"
                                    keyName="title"
                                    value={values.title}
                                    onChange={handleChange}
                                    error={!!(errors.title)}
                                    errorMessage={errors.title}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ChipSelector
                                    options={
                                        bookState.authors.map<ChipOption>((a: AuthorListItem) => ({
                                            value: a.authorId,
                                            name: `${a.name} (${a.country})`,
                                        } as ChipOption))
                                    }
                                    selectedOptions={bookState.book.authors.map((authorId) => {
                                        const author = bookState.authors.find((a) => a.authorId === authorId);
                                        return {
                                            value: author?.authorId,
                                            name: author?.name,
                                        } as ChipOption;
                                    })}
                                    updateSelection={(authorsSelected: ChipOption[]) => {
                                        const newAuthors = new Array<number>();
                                        authorsSelected.forEach((n: ChipOption) => {
                                            const author = bookState.authors.find(
                                                (r) => r.authorId === n.value,
                                            );
                                            if (author !== undefined) {
                                                newAuthors.push(author.authorId);
                                            }
                                        });
                                        // eslint-disable-next-line no-param-reassign
                                        values.authors = newAuthors;
                                        setBookState({
                                            ...bookState,
                                            book: {
                                                ...bookState.book,
                                                authors: newAuthors,
                                            },
                                        });
                                    }}
                                    error={!!(errors.authors)}
                                    errorMessage="A book must have an author."
                                    id="authorSelector"
                                    label="Authors"
                                    labelId="authorSelectLabel"
                                    textInputId="selectMultipleAuthors"
                                    name="authors"
                                />
                            </Grid>
                            <Grid item xs={12} style={{ paddingTop: '10px' }}>
                                {!bookState.newBook && (
                                    <Button
                                        sx={{ marginRight: '10px' }}
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (errors !== null) {
                                                updateBook(values, validateForm);
                                            }
                                        }}
                                    >
                                        Update
                                    </Button>
                                )}
                                {bookState.newBook && (
                                    <Button
                                        sx={{ marginRight: '10px' }}
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addBook(values, validateForm);
                                        }}
                                    >
                                        Add
                                    </Button>
                                )}

                                <Button
                                    sx={{ marginRight: '10px' }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        store.dispatch(push('/authors'));
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Formik>
            </Grid>
        </Grid>
    );
};

export default BookPage;

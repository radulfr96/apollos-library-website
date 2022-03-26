/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-props-no-spreading */
import { useParams } from 'react-router';
import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    CircularProgress, Grid, Button,
} from '@mui/material';
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone';
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
import Typedown from '../../components/shared/Typedown';
import TypedownOption from '../../interfaces/typedownOption';
import Dropdown from '../../components/shared/Dropdown';
import DropdownOption from '../../interfaces/dropdownOption';

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
            edition: undefined,
            coverImage: undefined,
            publicationFormatID: 0,
            fictionTypeID: 0,
            formTypeID: 0,
            publisherID: 0,
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
        <>
            <Grid container item xs={12}>
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
            <Formik
                initialValues={bookState.book}
                onSubmit={() => { }}
                validationSchema={
                    yup.object().shape({
                        title: yup.string()
                            .required('A book must have a title'),
                        isbn: yup.string()
                            .min(10, 'ISBN must be at least 10 digits long')
                            .max(13, 'ISBN cannot be more than 13 digits long'),
                        eisbn: yup.string()
                            .min(10, 'eISBN must be at least 10 digits long')
                            .max(13, 'eISBN cannot be more than 13 digits long'),
                        // genres: yup.array()
                        //     .min(1, 'A book must have a genre'),
                    })
                }
            >
                {({
                    values,
                    errors,
                    handleChange,
                    validateForm,
                }) => (
                    <>
                        <Grid container spacing={2} item xs={6}>
                            <Grid item xs={12}>
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
                            </Grid>
                            <Grid item xs={6}>
                                <InputTextField
                                    label="ISBN"
                                    type="text"
                                    keyName="isbn"
                                    value={values.isbn}
                                    onChange={handleChange}
                                    error={!!(errors.isbn)}
                                    errorMessage={errors.isbn}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputTextField
                                    label="eISBN"
                                    type="text"
                                    keyName="eisbn"
                                    value={values.eisbn}
                                    onChange={handleChange}
                                    error={!!(errors.eisbn)}
                                    errorMessage={errors.eisbn}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                            </Grid>
                            <Grid item xs={6}>
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
                            <Grid item xs={6}>
                                <InputTextField
                                    label="Subtitle"
                                    required
                                    type="text"
                                    keyName="Subtitle"
                                    value={values.subtitle}
                                    onChange={handleChange}
                                    error={!!(errors.subtitle)}
                                    errorMessage={errors.subtitle}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputTextField
                                    label="Edition"
                                    type="number"
                                    keyName="Edition"
                                    value={values.edition}
                                    onChange={handleChange}
                                    error={!!(errors.edition)}
                                    errorMessage={errors.edition}
                                />
                            </Grid>
                            <Grid item xs={6}>
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
                                    // updateSelection={(authorSelected: ChipOption) => {
                                    //     // eslint-disable-next-line no-param-reassign
                                    //     values.authors.push(authorSelected.value as number);
                                    //     setBookState({
                                    //         ...bookState,
                                    //         book: {
                                    //             ...bookState.book,
                                    //             authors: [...bookState.book.authors, authorSelected.value as number],
                                    //         },
                                    //     });
                                    // }}
                                    error={!!(errors.authors)}
                                    errorMessage="A book must have an author."
                                    id="authorSelector"
                                    label="Authors"
                                    labelId="authorSelectLabel"
                                    textInputId="selectMultipleAuthors"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typedown
                                    label="Publisher"
                                    options={
                                        bookState.publishers.map<TypedownOption>((publisher) => ({
                                            value: publisher.publisherId,
                                            name: `${publisher.name} (${publisher.country})`,
                                        } as TypedownOption))
                                    }
                                    value={bookState.book.publisherID?.toString()}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ChipSelector
                                    required
                                    options={
                                        bookState.genres.map<ChipOption>((g: Genre) => ({
                                            value: g.genreId,
                                            name: g.name,
                                        } as ChipOption))
                                    }
                                    selectedOptions={bookState.book.genres.map((genreId) => {
                                        const genre = bookState.genres.find((a) => a.genreId === genreId);
                                        return {
                                            value: genre?.genreId,
                                            name: genre?.name,
                                        } as ChipOption;
                                    })}
                                    // updateSelection={(authorSelected: ChipOption) => {
                                    //     // eslint-disable-next-line no-param-reassign
                                    //     values.authors.push(authorSelected.value as number);
                                    //     setBookState({
                                    //         ...bookState,
                                    //         book: {
                                    //             ...bookState.book,
                                    //             authors: [...bookState.book.authors, authorSelected.value as number],
                                    //         },
                                    //     });
                                    // }}
                                    error={!!(errors.genres)}
                                    errorMessage="A book must have a genre."
                                    id="genreSelector"
                                    label="Genres"
                                    labelId="genreSelectLabel"
                                    textInputId="selectMultipleGenres"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Dropdown
                                    required
                                    label="Publication Format"
                                    labelId="publicationFormatLabelId"
                                    id="publicationFormatID"
                                    onChange={(e: Event) => {
                                        const field = e.target as HTMLInputElement;
                                        bookState.book = {
                                            ...bookState.book,
                                            publicationFormatID: parseInt(field.value, 10),
                                        };
                                    }}
                                    options={
                                        bookState.publicationFormats.map<DropdownOption>((format: PublicationFormat) => ({
                                            value: format.typeId,
                                            text: format.name,
                                        } as DropdownOption))
                                    }
                                    // error={bookState.book.publicationFormatID === 0}
                                    errorMessage="A book must have a publication format."
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Dropdown
                                    required
                                    label="Fiction Type"
                                    labelId="fictionTypeLabelId"
                                    id="fictionType"
                                    onChange={(e: Event) => {
                                        const field = e.target as HTMLInputElement;
                                        bookState.book = {
                                            ...bookState.book,
                                            fictionTypeID: parseInt(field.value, 10),
                                        };
                                    }}
                                    options={
                                        bookState.fictionTypes.map<DropdownOption>((fictionType: FictionType) => ({
                                            value: fictionType.typeId,
                                            text: fictionType.name,
                                        } as DropdownOption))
                                    }
                                    // error={bookState.book.fictionTypeID === 0}
                                    errorMessage="A book must have a fiction type."
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Dropdown
                                    required
                                    label="Form Type"
                                    labelId="formTypeLabelId"
                                    id="formType"
                                    onChange={(e: Event) => {
                                        const field = e.target as HTMLInputElement;
                                        bookState.book = {
                                            ...bookState.book,
                                            formTypeID: parseInt(field.value, 10),
                                        };
                                    }}
                                    options={
                                        bookState.formTypes.map<DropdownOption>((form: FormType) => ({
                                            value: form.typeId,
                                            text: form.name,
                                        } as DropdownOption))
                                    }
                                    // error={bookState.book.formTypeID === 0}
                                    errorMessage="A book must have a form type."
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {!bookState.newBook && (
                                    <Button
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
                                        store.dispatch(push('/books'));
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            {/* <Grid item xs={12}>
                                {
                                    bookState.book.coverImage !== undefined && (<img alt="Book Cover" src={URL.createObjectURL(new Blob(bookState.book.coverImage))} />)
                                }
                            </Grid> */}
                            <Grid item xs={12}>
                                <DropzoneAreaBase
                                    onAdd={(fileObjs: FileObject[]) => {
                                        bookState.book = {
                                            ...bookState.book,
                                            coverImage: fileObjs[0].file,
                                        };
                                    }}
                                    onDelete={() => {
                                        bookState.book = {
                                            ...bookState.book,
                                            coverImage: undefined,
                                        };
                                    }}
                                    fileObjects={[]}
                                    acceptedFiles={['image/*']}
                                />
                            </Grid>
                        </Grid>
                    </>
                )}
            </Formik>
        </>
    );
};

export default BookPage;

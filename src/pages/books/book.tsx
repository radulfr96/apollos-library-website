/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-props-no-spreading */
import { useParams } from 'react-router';
import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    CircularProgress, Grid, Button, Card, CardHeader, CardContent, CardActions,
} from '@mui/material';
import { DropzoneAreaBase, FileObject } from 'mui-file-dropzone';
import { push } from 'connected-react-router';
import { useStore } from 'react-redux';
import { useSnackbar } from 'notistack';
import { AuthorListItem } from '../../interfaces/authorListItem';
import { Genre } from '../../interfaces/genre';
import PublicationFormat from '../../interfaces/publicationFormat';
import FormType from '../../interfaces/formType';
import FictionType from '../../interfaces/fictionType';
import Book from '../../interfaces/book';
import { AppContext } from '../../context';
import ConfigHelper from '../../config/configHelper';
import PageHeading from '../../components/shared/pageHeading';
import InputTextField from '../../components/shared/inputTextField';
import ChipSelector from '../../components/shared/chipSelector';
import ChipOption from '../../interfaces/chipOption';
import Typedown from '../../components/shared/typedown';
import TypedownOption from '../../interfaces/typedownOption';
import Dropdown from '../../components/shared/dropdown';
import DropdownOption from '../../interfaces/dropdownOption';
import { SeriesListItem } from '../../interfaces/seriesListItem';
import BusinessListItem from '../../interfaces/businessListItem';

interface BookParams {
    id: string;
}

interface BookState {
    businesses: BusinessListItem[];
    authors: AuthorListItem[];
    publicationFormats: PublicationFormat[];
    formTypes: FormType[];
    fictionTypes: FictionType[];
    genres: Genre[];
    series: SeriesListItem[];
    book: Book;
    newBook: boolean;
    changingImage: boolean;
}

const BookPage = () => {
    const [bookState, setBookState] = useState<BookState>({
        businesses: [],
        authors: [],
        publicationFormats: [],
        formTypes: [],
        fictionTypes: [],
        genres: [],
        series: [],
        book: {
            bookId: 0,
            isbn: '',
            eISBN: '',
            title: '',
            subtitle: '',
            publicationFormatId: 1,
            businessId: undefined,
            fictionTypeId: 1,
            formTypeId: 1,
            genres: [],
            authors: [],
            series: [],
        },
        newBook: false,
        changingImage: false,
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

        requests.push(Axios.get(`${configHelper.apiUrl}/api/business/publishers`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        requests.push(Axios.get(`${configHelper.apiUrl}/api/genre`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        requests.push(Axios.get(`${configHelper.apiUrl}/api/series`, {
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
                            businesses: responses[2].value.data.businesses,
                            genres: responses[3].value.data.genres,
                            series: responses[4].value.data.series,
                            newBook: false,
                            book: booksResponse.data as Book,
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
                    businesses: responses[2].value.data.businesses,
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
                    Axios.put(`${configHelper.apiUrl}/api/book`, book, {
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
                                renderWarningSnackbar('Unable to update book invalid input');
                            } else {
                                renderErrorSnackbar('Unable to update book please contact admin');
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
                                renderWarningSnackbar('Unable to add book invalid input');
                            } else {
                                renderErrorSnackbar('Unable to add book please contact admin');
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
                        genres: yup.array()
                            .min(1, 'A book must have a genre'),
                    })
                }
            >
                {({
                    values,
                    errors,
                    handleChange,
                    setFieldValue,
                    validateForm,
                }) => (
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        {
                                            !bookState.newBook && (
                                                <Grid>
                                                    <InputTextField
                                                        label="Book Id"
                                                        required
                                                        type="text"
                                                        keyName="bookId"
                                                        value={values.bookId}
                                                        onChange={handleChange}
                                                        error={!!(errors.bookId)}
                                                        errorMessage={errors.bookId}
                                                        readonly
                                                    />
                                                </Grid>
                                            )
                                        }
                                    </Grid>
                                    <Grid item xs={6} />
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
                                            keyName="eISBN"
                                            value={values.eISBN}
                                            onChange={handleChange}
                                            error={!!(errors.eISBN)}
                                            errorMessage={errors.eISBN}
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
                                            updateSelection={(authorSelected: ChipOption) => {
                                                // eslint-disable-next-line no-param-reassign
                                                values.authors.push(authorSelected.value as number);
                                                setBookState({
                                                    ...bookState,
                                                    book: {
                                                        ...bookState.book,
                                                        authors: [...bookState.book.authors, authorSelected.value as number],
                                                    },
                                                });
                                            }}
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
                                            label="Business"
                                            id="businessId"
                                            options={
                                                bookState.businesses.map<TypedownOption>((business) => ({
                                                    value: business.businessId,
                                                    name: `${business.name} (${business.country})`,
                                                } as TypedownOption))
                                            }
                                            value={values.businessId?.toString()}
                                            updateSelection={(selected?: number | string) => {
                                                if (selected !== undefined) {
                                                    setFieldValue('businessId', selected);
                                                    setBookState({
                                                        ...bookState,
                                                        book: {
                                                            ...bookState.book,
                                                            businessId: selected as number,
                                                        },
                                                    });
                                                }
                                            }}
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
                                            updateSelection={(genreSelected: ChipOption) => {
                                                // eslint-disable-next-line no-param-reassign
                                                values.genres.push(genreSelected.value as number);
                                                setBookState({
                                                    ...bookState,
                                                    book: {
                                                        ...bookState.book,
                                                        genres: [...bookState.book.genres, genreSelected.value as number],
                                                    },
                                                });
                                            }}
                                            error={!!(errors.genres)}
                                            errorMessage="A book must have a genre."
                                            id="genres"
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
                                            id="publicationFormatId"
                                            keyName="publicationFormatId"
                                            value={values.publicationFormatId}
                                            onChange={handleChange}
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
                                            id="fictionTypeId"
                                            value={values.fictionTypeId}
                                            keyName="fictionTypeId"
                                            onChange={handleChange}
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
                                            id="formTypeId"
                                            keyName="formTypeId"
                                            value={values.formTypeId}
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
                                    <Grid item xs={6}>
                                        <ChipSelector
                                            options={
                                                bookState.series.map<ChipOption>((s: SeriesListItem) => ({
                                                    value: s.seriesId,
                                                    name: s.name,
                                                } as ChipOption))
                                            }
                                            selectedOptions={bookState.book.series.map((seriesId) => {
                                                const series = bookState.series.find((s) => s.seriesId === seriesId);
                                                return {
                                                    value: series?.seriesId,
                                                    name: series?.name,
                                                } as ChipOption;
                                            })}
                                            updateSelection={(seriesSelected: ChipOption) => {
                                                // eslint-disable-next-line no-param-reassign
                                                values.series.push(seriesSelected.value as number);
                                                setBookState({
                                                    ...bookState,
                                                    book: {
                                                        ...bookState.book,
                                                        series: [...bookState.book.series, seriesSelected.value as number],
                                                    },
                                                });
                                            }}
                                            id="series"
                                            label="Series"
                                            labelId="seriesSelectLabel"
                                            textInputId="selectMultipleSeries"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
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
                            </Grid>
                            <Grid item xs={3}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Card sx={{ width: '325px' }}>
                                            <CardHeader
                                                title="Book Cover Image"
                                            />
                                            <CardContent>
                                                {
                                                    (bookState.book.coverImage && bookState.book.coverImage !== '' && !bookState.changingImage) && (<img style={{ maxWidth: '300px', maxHeight: '460px' }} alt="Book Cover" src={bookState.book.coverImage} />)
                                                }

                                                {
                                                    ((!bookState.book.coverImage) || bookState.book.coverImage === '' || bookState.changingImage) && (
                                                        <DropzoneAreaBase
                                                            onAdd={(fileObjs: FileObject[]) => {
                                                                const imageData = fileObjs[0].data as string;
                                                                setFieldValue('coverImage', imageData);
                                                                setBookState({
                                                                    ...bookState,
                                                                    book: {
                                                                        ...bookState.book,
                                                                        coverImage: imageData,
                                                                    },
                                                                    changingImage: false,
                                                                });
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
                                                    )
                                                }
                                            </CardContent>
                                            <CardActions>
                                                {(bookState.book.coverImage && bookState.book.coverImage !== '' && !bookState.changingImage)
                                                    && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => {
                                                                setBookState({
                                                                    ...bookState,
                                                                    changingImage: true,
                                                                });
                                                            }}
                                                        >
                                                            Change
                                                        </Button>
                                                    )}
                                                {(bookState.changingImage && bookState.book.coverImage && bookState.book.coverImage !== '' && bookState.changingImage)
                                                    && (
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={() => {
                                                                setBookState({
                                                                    ...bookState,
                                                                    changingImage: false,
                                                                });
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}

                                            </CardActions>
                                        </Card>
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

export default BookPage;

import {
    Card, CardContent, CardHeader, CircularProgress, Grid, Typography,
} from '@mui/material';
import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import ReadOnlyLabel from '../../../components/shared/readOnlyLabel';
import ReadOnlyText from '../../../components/shared/readOnlyText';
import ConfigHelper from '../../../config/configHelper';
import BookEntryDetails from '../../../interfaces/bookEntryDetails';
import { AppContext } from '../../../userContext';

interface BookEntryProp {
    entryId: number;
}

interface BookEntryState {
    details: BookEntryDetails;
}

const BookEntry = (props: BookEntryProp) => {
    const { entryId } = props;
    const [bookState, setBookState] = useState<BookEntryState>(
        {
            details: {
                bookId: 0,
                isbn: '',
                eISBN: '',
                title: '',
                subtitle: '',
                coverImage: '',
            },
        },
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }
        Axios.get(`${configHelper.apiUrl}/api/book/bookrecord/${entryId}`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setBookState({
                    ...bookState,
                    details: response.data,
                });
                setIsLoading(false);
            });
    }, [context]);

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid container item spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">
                    Book Entry Details
                </Typography>
            </Grid>
            <Grid item container xs={9}>
                <Grid item xs={3}>
                    <ReadOnlyLabel text="Book Record ID" />
                    <ReadOnlyText
                        text={entryId}
                    />
                </Grid>
                <Grid item xs={3}>
                    <ReadOnlyLabel text="Book ID" />
                    <ReadOnlyText
                        text={bookState.details.bookId}
                    />
                </Grid>
                <Grid item xs={3}>
                    <ReadOnlyLabel text="Title" />
                    <ReadOnlyText
                        text={bookState.details.title}
                    />
                </Grid>
                <Grid item xs={3}>
                    <ReadOnlyLabel text="ISBN" />
                    <ReadOnlyText
                        text={bookState.details.isbn}
                    />
                </Grid>
                <Grid item xs={3}>
                    <ReadOnlyLabel text="eISBN" />
                    <ReadOnlyText
                        text={bookState.details.eISBN}
                    />
                </Grid>
            </Grid>
            <Grid item xs={3}>
                <Card sx={{ width: '325px' }}>
                    <CardHeader
                        title="Book Cover Image"
                    />
                    <CardContent>
                        {
                            (bookState.details.coverImage && bookState.details.coverImage !== '') && (<img style={{ maxWidth: '300px', maxHeight: '460px' }} alt="Book Cover" src={bookState.details.coverImage} />)
                        }

                        {
                            ((!bookState.details.coverImage) || bookState.details.coverImage === '') && (
                                <Typography>
                                    Book cover not set
                                </Typography>
                            )
                        }
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default BookEntry;

import {
    CircularProgress, Grid, Typography,
} from '@mui/material';
import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import ReadOnlyLabel from '../../../components/shared/readOnlyLabel';
import ReadOnlyText from '../../../components/shared/readOnlyText';
import ConfigHelper from '../../../config/configHelper';
import AuthorEntryDetails from '../../../interfaces/authorEntryDetails';
import { AppContext } from '../../../userContext';

interface AuthorEntryProp {
    entryId: number;
}

interface AuthorEntryState {
    details: AuthorEntryDetails;
}

const BookEntry = (props: AuthorEntryProp) => {
    const { entryId } = props;
    const [bookState, setBookState] = useState<AuthorEntryState>(
        {
            details: {
                authorId: 0,
                description: '',
                firstName: '',
                middleName: '',
                lastName: '',
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
        Axios.get(`${configHelper.apiUrl}/api/author/authorrecord/${entryId}`, {
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
        <Grid container spacing={2}>
            <Grid item xs={9}>
                <Grid item xs={12}>
                    <Typography variant="h4">
                        Author Entry Details
                    </Typography>
                </Grid>
                <Grid item container xs={12}>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Author Record ID" />
                        <ReadOnlyText
                            text={entryId}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Author ID" />
                        <ReadOnlyText
                            text={bookState.details.authorId}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Fist Name" />
                        <ReadOnlyText
                            text={bookState.details.firstName}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Middle Name" />
                        <ReadOnlyText
                            text={bookState.details.middleName}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Last Name" />
                        <ReadOnlyText
                            text={bookState.details.lastName}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Description" />
                        <ReadOnlyText
                            text={bookState.details.description}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default BookEntry;

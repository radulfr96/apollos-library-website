import {
    CircularProgress, Grid, Typography,
} from '@mui/material';
import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import ReadOnlyLabel from '../../../components/shared/readOnlyLabel';
import ReadOnlyText from '../../../components/shared/readOnlyText';
import ConfigHelper from '../../../config/configHelper';
import SeriesEntryDetails from '../../../interfaces/seriesEntryDetails';
import { AppContext } from '../../../userContext';

interface SeriesEntryProp {
    entryId: number;
}

interface SeriesEntryState {
    details: SeriesEntryDetails;
}

const BookEntry = (props: SeriesEntryProp) => {
    const { entryId } = props;
    const [bookState, setBookState] = useState<SeriesEntryState>(
        {
            details: {
                seriesId: 0,
                name: '',
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
        Axios.get(`${configHelper.apiUrl}/api/series/seriesrecord/${entryId}`, {
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
                        Series Entry Details
                    </Typography>
                </Grid>
                <Grid item container xs={12}>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Series Record ID" />
                        <ReadOnlyText
                            text={entryId}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Series ID" />
                        <ReadOnlyText
                            text={bookState.details.seriesId}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Name" />
                        <ReadOnlyText
                            text={bookState.details.name}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default BookEntry;

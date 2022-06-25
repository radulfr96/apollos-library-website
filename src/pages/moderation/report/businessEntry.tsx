import {
    CircularProgress, Grid, Typography,
} from '@mui/material';
import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import ReadOnlyLabel from '../../../components/shared/readOnlyLabel';
import ReadOnlyText from '../../../components/shared/readOnlyText';
import ConfigHelper from '../../../config/configHelper';
import BusinessEntryDetails from '../../../interfaces/businessEntryDetails';
import { AppContext } from '../../../userContext';

interface BusinessEntryProp {
    entryId: number;
}

interface BusinessEntryState {
    details: BusinessEntryDetails;
}

const BookEntry = (props: BusinessEntryProp) => {
    const { entryId } = props;
    const [bookState, setBookState] = useState<BusinessEntryState>(
        {
            details: {
                businessId: 0,
                name: '',
                website: '',
                streetAddress: '',
                city: '',
                postcode: '',
                state: '',
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
        Axios.get(`${configHelper.apiUrl}/api/business/businessrecord/${entryId}`, {
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
                        Business Entry Details
                    </Typography>
                </Grid>
                <Grid item container xs={12}>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Business Record ID" />
                        <ReadOnlyText
                            text={entryId}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Business ID" />
                        <ReadOnlyText
                            text={bookState.details.businessId}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Name" />
                        <ReadOnlyText
                            text={bookState.details.name}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Website" />
                        <ReadOnlyText
                            text={bookState.details.website}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="City" />
                        <ReadOnlyText
                            text={bookState.details.city}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Postcode" />
                        <ReadOnlyText
                            text={bookState.details.postcode}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="State" />
                        <ReadOnlyText
                            text={bookState.details.state}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default BookEntry;

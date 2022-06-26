import { CircularProgress, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import ConfigHelper from '../../config/configHelper';
import EntryReportListItem from '../../interfaces/entryReportListItem';
import { AppContext } from '../../userContext';

interface UserModerationState {
    username: string;
    reportsByUser: Array<EntryReportListItem>;
    userEntryReports: Array<EntryReportListItem>;
}

interface UserModerationParams {
    id?: string;
}

const UserModeration = () => {
    const [userModerationState, setUserModerationState] = useState<UserModerationState>({
        username: '',
        reportsByUser: [],
        userEntryReports: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const params = useParams<UserModerationParams>();
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        const requests = [];

        requests.push(Axios.get(`${configHelper.idpUrl}/api/user/${params.id}`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        requests.push(Axios.get(`${configHelper.apiUrl}/api/moderation/reportedentriesbyuser/${params.id}`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        requests.push(Axios.get(`${configHelper.apiUrl}/api/moderation/reportsbyuser/${params.id}`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        Promise.allSettled(requests).then((responses: Array<any>) => {
            setUserModerationState({
                username: responses[0].value.data,
                userEntryReports: responses[1].value.data.reports,
                reportsByUser: responses[2].value.data.reports,
            });
            setIsLoading(false);
        });
    }, [context]);

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={12}>
            <Grid container spacing={2}>
                Moderation for user
                {' '}
                {userModerationState.username}
            </Grid>
        </Grid>
    );
};

export default UserModeration;

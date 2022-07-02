import {
    Button, CircularProgress, Grid, Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { useStore } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Guid } from 'guid-typescript';
import { push } from 'connected-react-router';
import ConfigHelper from '../../config/configHelper';
import EntryReportListItem from '../../interfaces/entryReportListItem';
import { AppContext } from '../../userContext';
import ReportsTable from '../../components/reportsTable';

interface UserModerationState {
    username: string;
    userId: Guid;
    reportsByUser: Array<EntryReportListItem>;
    userEntryReports: Array<EntryReportListItem>;
}

interface UserModerationParams {
    id?: string;
}

const UserModeration = () => {
    const [userModerationState, setUserModerationState] = useState<UserModerationState>({
        username: '',
        userId: Guid.createEmpty(),
        reportsByUser: [],
        userEntryReports: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const params = useParams<UserModerationParams>();
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const store = useStore();
    const snackbar = useSnackbar();

    const renderErrorSnackbar = (message: string): void => {
        snackbar.enqueueSnackbar(message, {
            variant: 'error',
        });
    };

    const renderSuccessSnackbar = (message: string): void => {
        snackbar.enqueueSnackbar(message, {
            variant: 'success',
        });
    };

    const renderWarningSnackbar = (message: string): void => {
        snackbar.enqueueSnackbar(message, {
            variant: 'warning',
        });
    };

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
                userId: responses[0].value.data.userId,
                username: responses[0].value.data.username,
                userEntryReports: responses[1].value.data.entryReports,
                reportsByUser: responses[2].value.data.entryReports,
            });
            setIsLoading(false);
        });
    }, [context]);

    const banUser = () => {
        Axios.put(`${configHelper.idpUrl}/api/user/${userModerationState.userId}/ban`, {}, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Ban successful');
                    context.clearUserInfo();
                    store.dispatch(push('/'));
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    error.response.messages.forEach((message: string) => {
                        renderWarningSnackbar(message);
                    });
                } else {
                    renderErrorSnackbar('Unable to ban account please contact admin');
                }
            });
    };

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={12}>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Typography variant="h4">
                        Moderation for user
                        {' '}
                        {userModerationState.username}
                    </Typography>
                </Grid>
                <Grid item xs={9}>
                    <Button color="error" variant="contained" onClick={banUser}>
                        Ban User
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        Entries Reported by User
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <ReportsTable reports={userModerationState.reportsByUser} />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        Reported Entries Created by User
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <ReportsTable reports={userModerationState.userEntryReports} />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default UserModeration;

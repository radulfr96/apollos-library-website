import {
    Button, CircularProgress, Grid, Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { useStore } from 'react-redux';
import { useSnackbar } from 'notistack';
import { push } from 'connected-react-router';
import { Guid } from 'guid-typescript';
import EntryTypeEnum from '../../enums/entryTypeEnum';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../userContext';

interface ReportButtonProps {
    entryRecordId: number;
    entryType: EntryTypeEnum;
    createdBy?: Guid;
}

interface ReportButtonState {
    createdByUsername: string;
}

const ReportButton = (props: ReportButtonProps) => {
    const { entryRecordId, entryType, createdBy } = props;
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const store = useStore();
    const snackbar = useSnackbar();
    const [reportButtonState, setReportButtonState] = useState<ReportButtonState>({
        createdByUsername: '',
    });

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        Axios.get(`${configHelper.idpUrl}/api/user/${createdBy}/username`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setReportButtonState({
                    createdByUsername: response.data.username,
                });
                setIsLoading(false);
            });
    });

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

    const reportEntry = () => {
        Axios.put(`${configHelper.apiUrl}/api/moderation`, {
            entryRecordId,
            entryType,
            createdBy,
        }, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Report successful');
                    store.dispatch(push('/'));
                }
            })
            .catch(() => {
                renderErrorSnackbar('Unable to report entry please contact admin');
            });
    };

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <Typography>
                    Created by
                    {' '}
                    {reportButtonState.createdByUsername}
                    .
                    <Button
                        variant="text"
                        onClick={reportEntry}
                    >
                        Report Entry
                    </Button>
                </Typography>
            </Grid>
        </Grid>
    );
};

export default ReportButton;

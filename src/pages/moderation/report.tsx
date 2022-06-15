import {
    Button, CircularProgress, Grid, Typography,
} from '@mui/material';
import { Guid } from 'guid-typescript';
import React, { useContext, useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import Axios from 'axios';
import { push } from 'connected-react-router';
import { useParams } from 'react-router-dom';
import PageHeading from '../../components/shared/pageHeading';
import ConfigHelper from '../../config/configHelper';
import EntryReportListItem from '../../interfaces/entryReportListItem';
import { AppContext } from '../../userContext';
import ReadOnlyText from '../../components/shared/readOnlyText';
import ReadOnlyLabel from '../../components/shared/readOnlyLabel';

interface ReportParams {
    id?: string;
}

interface ReportState {
    report: EntryReportListItem;
    reportedUser: string;
    createdUser: string;
}

const Report = () => {
    const [reportState, setReportState] = useState<ReportState>({
        report: {
            reportId: 0,
            entryId: 0,
            entryTypeId: 0,
            entryType: '',
            entryStatusId: 0,
            entryStatus: '',
            reportedBy: Guid.createEmpty(),
            reportedDate: new Date(),
            createdBy: Guid.createEmpty(),
            createdDate: new Date(),
        },
        createdUser: '',
        reportedUser: '',
    });
    const params = useParams<ReportParams>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const store = useStore();

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        if (params.id !== undefined && params.id !== null) {
            Axios.get(`${configHelper.apiUrl}/api/moderation/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${context.getToken()}`,
                },
            })
                .then((response) => {
                    setReportState({
                        ...reportState,
                        report: response.data.createdDate,
                    });
                }).then(() => {
                    const requests = [];

                    requests.push(Axios.get(`${configHelper.idpUrl}/api/user/${reportState.report.createdBy}`, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    }));

                    requests.push(Axios.get(`${configHelper.idpUrl}/api/user/${reportState.report.reportedBy}`, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    }));

                    Promise.allSettled(requests).then((responses: Array<any>) => {
                        setReportState({
                            ...reportState,
                            createdUser: responses[0].value.data.username,
                            reportedUser: responses[0].value.data.username,
                        });
                        setIsLoading(false);
                    });
                });
        }
    }, [context]);

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <>
            <Grid item xs={12}>
                <PageHeading headingText="Report Details" />
            </Grid>
            <Grid item xs={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4">
                            Report
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Report ID" />
                        <ReadOnlyText
                            text={params.id}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Entry Type" />
                        <ReadOnlyText
                            text={reportState.report.entryType}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Created By" />
                        <ReadOnlyText
                            text={reportState.createdUser}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReadOnlyLabel text="Reported By" />
                        <ReadOnlyText
                            text={reportState.reportedUser}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4">
                            Entry
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4">
                            Entry
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                store.dispatch(push('/moderation'));
                            }}
                        >
                            Confirm
                        </Button>
                        <Button
                            sx={{ marginLeft: '10px' }}
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                store.dispatch(push('/moderation'));
                            }}
                        >
                            Reject
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Report;

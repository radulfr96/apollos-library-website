import {
    Button, CircularProgress, Grid,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { Guid } from 'guid-typescript';
import React, { useContext, useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import Axios from 'axios';
import { push } from 'connected-react-router';
import { useParams } from 'react-router-dom';
import PageHeading from '../../../components/shared/pageHeading';
import ConfigHelper from '../../../config/configHelper';
import EntryReportListItem from '../../../interfaces/entryReportListItem';
import { AppContext } from '../../../userContext';
import BasicReportInfo from './basicReportInfo';
import BookEntry from './bookEntry';
import EntryTypeEnum from '../../../enums/entryTypeEnum';
import AuthorEntry from './authorEntry';
import BusinessEntry from './businessEntry';
import SeriesEntry from './seriesEntry';
import EntryReportStatusEnum from '../../../enums/entryReportStatusEnum';

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
            entryRecordId: 0,
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
    const { enqueueSnackbar } = useSnackbar();
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
                        report: response.data,
                    });
                    setIsLoading(false);
                });
        }
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

    const updateReport = (status: EntryReportStatusEnum) => {
        Axios.put(`${configHelper.apiUrl}/api/moderation`, {
            entryReportId: params.id,
            entryReportStatus: status,
        }, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Update successful');
                    store.dispatch(push('/moderation'));
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    renderWarningSnackbar('Unable to update report invalid input');
                } else {
                    renderErrorSnackbar('Unable to update report please contact admin');
                }
            });
    };

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <PageHeading headingText="Report Details" />
            </Grid>
            <Grid item xs={12}>
                <BasicReportInfo report={reportState.report} reportId={params.id} />
            </Grid>
            <Grid item xs={12}>
                {
                    reportState.report.entryTypeId === EntryTypeEnum.Book
                    && (
                        <BookEntry entryId={reportState.report.entryRecordId} />
                    )
                }
                {
                    reportState.report.entryTypeId === EntryTypeEnum.Author
                    && (
                        <AuthorEntry entryId={reportState.report.entryRecordId} />
                    )
                }
                {
                    reportState.report.entryTypeId === EntryTypeEnum.Series
                    && (
                        <SeriesEntry entryId={reportState.report.entryRecordId} />
                    )
                }
                {
                    reportState.report.entryTypeId === EntryTypeEnum.Business
                    && (
                        <BusinessEntry entryId={reportState.report.entryRecordId} />
                    )
                }
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '10px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        updateReport(EntryReportStatusEnum.Confirmed);
                    }}
                >
                    Confirm
                </Button>
                <Button
                    sx={{ marginLeft: '10px' }}
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        updateReport(EntryReportStatusEnum.Cancelled);
                    }}
                >
                    Reject
                </Button>
            </Grid>
        </Grid>
    );
};

export default Report;

import { CircularProgress, Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import ReadOnlyLabel from '../../../components/shared/readOnlyLabel';
import ReadOnlyText from '../../../components/shared/readOnlyText';
import EntryReportListItem from '../../../interfaces/entryReportListItem';
import { AppContext } from '../../../userContext';
import ConfigHelper from '../../../config/configHelper';

interface BasicInfoState {
    createdUser: string;
    reportedUser: string;
}

interface BasicInfoProps {
    report: EntryReportListItem;
    reportId?: string;
}

const BasicReportInfo = (props: BasicInfoProps) => {
    const { report, reportId } = props;
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);

    const [basicInfoState, setBasicInfoState] = useState<BasicInfoState>({
        createdUser: '',
        reportedUser: '',
    });

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        const requests = [];

        requests.push(Axios.get(`${configHelper.idpUrl}/api/user/${report.createdBy}`));
        requests.push(Axios.get(`${configHelper.idpUrl}/api/user/${report.reportedBy}`));

        Promise.allSettled(requests).then((responses: Array<any>) => {
            setBasicInfoState({
                createdUser: responses[0].value.data,
                reportedUser: responses[1].value.data,
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
                <Grid item xs={12}>
                    <Typography variant="h4">
                        Report
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <ReadOnlyLabel text="Report ID" />
                    <ReadOnlyText
                        text={reportId}
                    />
                </Grid>
                <Grid item xs={6}>
                    <ReadOnlyLabel text="Entry Type" />
                    <ReadOnlyText
                        text={report.entryType}
                    />
                </Grid>
                <Grid item xs={6}>
                    <ReadOnlyLabel text="Created By" />
                    <ReadOnlyText
                        text={basicInfoState.createdUser}
                    />
                </Grid>
                <Grid item xs={6}>
                    <ReadOnlyLabel text="Reported By" />
                    <ReadOnlyText
                        text={basicInfoState.reportedUser}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default BasicReportInfo;

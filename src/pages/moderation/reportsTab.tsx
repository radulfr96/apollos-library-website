import { CircularProgress } from '@mui/material';
import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import ReportTable from '../../components/reportsTable';
import ConfigHelper from '../../config/configHelper';
import EntryReportListItem from '../../interfaces/entryReportListItem';
import { AppContext } from '../../userContext';

interface ReportsTabState {
    reports: Array<EntryReportListItem>;
}

const ReportsTab = () => {
    const [reportsTabState, setReportsTabState] = useState<ReportsTabState>({
        reports: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);

    const getReports = () => new Promise<void>((resolve) => {
        Axios.get(`${configHelper.apiUrl}/api/moderation`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setReportsTabState({ ...reportsTabState, reports: response.data.entryReports });
            });
        resolve();
    });

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }
        getReports()
            .then(() => {
                setIsLoading(false);
            });
    }, [context]);

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <ReportTable reports={reportsTabState.reports} />
    );
};

export default ReportsTab;

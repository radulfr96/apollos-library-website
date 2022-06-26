import {
    Box, Grid, Paper, Tabs, Tab,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import PageHeading from '../../components/shared/pageHeading';
import TabPanel from '../../components/shared/tabPanel';
import { AppContext } from '../../userContext';
import ReportsTab from './reportsTab';
import UsersTab from './usersTab';

interface ModerationState {
    tab: number;
}

const Moderation = () => {
    const context = useContext(AppContext);

    const [myAccountState, setMyAccountState] = useState<ModerationState>({
        tab: 0,
    });

    const handleTabChange = (event: any, newValue: any) => {
        setMyAccountState({ ...myAccountState, tab: newValue });
    };

    return (
        <Grid item xs={12} container justifyContent="center">
            <Grid item xs={12}>
                <PageHeading headingText="Moderation" />
            </Grid>
            {
                context.isAdmin() && (
                    <Grid item xs={12}>
                        <Paper>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    onChange={handleTabChange}
                                    value={myAccountState.tab}
                                >
                                    <Tab label="Reports" />
                                    <Tab label="Users" />
                                </Tabs>
                            </Box>
                            <TabPanel value={myAccountState.tab} index={0}>
                                <ReportsTab />
                            </TabPanel>
                            <TabPanel value={myAccountState.tab} index={1}>
                                <UsersTab />
                            </TabPanel>
                        </Paper>
                    </Grid>
                )
            }
        </Grid>
    );
};

export default Moderation;

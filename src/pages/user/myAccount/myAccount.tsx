import React, { useState } from 'react';
import {
    Paper, Tabs, Tab, Box, Grid,
} from '@mui/material';
import MyDetails from './accountDetails';
import DeactivateAccount from './deactivateAccount';
import UpdatePassword from './updatePassword';
import TabPanel from '../../../components/shared/tabPanel';
import BudgetSettings from './budgetSettings';

interface MyAccountState {
    tab: number;
}

const MyAccount = () => {
    const [myAccountState, setMyAccountState] = useState<MyAccountState>({
        tab: 0,
    });

    const handleTabChange = (event: any, newValue: any) => {
        setMyAccountState({ ...myAccountState, tab: newValue });
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={1} />
            <Grid item xs={10}>
                <Paper sx={{ width: '1000px' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            onChange={handleTabChange}
                            value={myAccountState.tab}
                        >
                            <Tab label="My Account" />
                            <Tab label="Update Password" />
                            <Tab label="Deactivate Account" />
                            <Tab label="Budget Settings" />
                        </Tabs>
                    </Box>
                    <TabPanel value={myAccountState.tab} index={0}>
                        <MyDetails />
                    </TabPanel>
                    <TabPanel value={myAccountState.tab} index={1}>
                        <UpdatePassword />
                    </TabPanel>
                    <TabPanel value={myAccountState.tab} index={2}>
                        <DeactivateAccount />
                    </TabPanel>
                    <TabPanel value={myAccountState.tab} index={2}>
                        <BudgetSettings />
                    </TabPanel>
                </Paper>
            </Grid>
            <Grid item xs={1} />
        </Grid>
    );
};

export default MyAccount;

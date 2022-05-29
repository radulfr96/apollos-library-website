import React, { useState } from 'react';
import {
    Paper, Tabs, Tab, Typography, Box,
} from '@mui/material';
import MyDetails from './accountDetails';
import DeactivateAccount from './deactivateAccount';
import UpdatePassword from './updatePassword';

interface TabPanelProps {
    children: React.ReactNode;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const {
        children, value, index,
    } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-prevent-tabpanel-${index}`}
            aria-labelledby={`scrollable-prevent-tab-${index}`}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
};

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
        <Paper sx={{ width: '1000px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    onChange={handleTabChange}
                    value={myAccountState.tab}
                >
                    <Tab label="My Account" />
                    <Tab label="Update Password" />
                    <Tab label="Deactivate Account" />
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
        </Paper>
    );
};

export default MyAccount;

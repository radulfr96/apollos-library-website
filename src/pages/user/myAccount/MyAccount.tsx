import React, { useState } from 'react';
import {
    Paper, Tabs, Tab, Typography, Box,
} from '@mui/material';
import MyDetails from './MyDetails';
import ChangeUsername from './ChangeUsername';
import UpdatePassword from './UpdatePassword';

interface TabPanelProps {
    children: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps): JSX.Element {
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
}

interface MyAccountState {
    tab: number;
}

export default function MyAccount(): JSX.Element {
    const [myAccountState, setMyAccountState] = useState<MyAccountState>({
        tab: 1,
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
                    <Tab label="My Details" />
                    <Tab label="Change Username" />
                    <Tab label="Change Password" />
                </Tabs>
            </Box>
            <TabPanel value={myAccountState.tab} index={0}>
                <MyDetails />
            </TabPanel>
            <TabPanel value={myAccountState.tab} index={1}>
                <ChangeUsername />
            </TabPanel>
            <TabPanel value={myAccountState.tab} index={2}>
                <UpdatePassword />
            </TabPanel>
        </Paper>
    );
}

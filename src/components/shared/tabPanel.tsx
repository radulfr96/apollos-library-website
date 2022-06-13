import React from 'react';
import { Box, Typography } from '@mui/material';

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

export default TabPanel;

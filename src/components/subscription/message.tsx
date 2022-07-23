import { Box, Typography } from '@mui/material';
import React from 'react';

interface MessageProps {
    message: string;
}

const Message = (props: MessageProps) => {
    const { message } = props;
    return (
        <Box>
            <Typography variant="h3">Subscription Cancelled</Typography>
            <Typography variant="body1">{message}</Typography>
        </Box>
    );
};

export default Message;

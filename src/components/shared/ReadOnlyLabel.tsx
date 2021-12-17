import React from 'react';
import {
    Typography,
} from '@mui/material';

interface ReadOnlyLabelProps {
    text: string | undefined;
}

const ReadOnlyLabel = (props: ReadOnlyLabelProps) => (
    <Typography
        sx={{
            fontSize: '22px',
            paddingTop: '10px',
        }}
    >
        {props.text}
    </Typography>
);

export default ReadOnlyLabel;

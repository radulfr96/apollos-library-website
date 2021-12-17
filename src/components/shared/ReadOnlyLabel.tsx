import React from 'react';
import {
    Typography,
} from '@mui/material';

interface ReadOnlyLabelProps {
    text?: string;
}

const ReadOnlyLabel = (props: ReadOnlyLabelProps) => {
    const { text } = props;

    return (
        <Typography
            sx={{
                fontSize: '22px',
                paddingTop: '10px',
            }}
        >
            {text}
        </Typography>
    );
};

export default ReadOnlyLabel;

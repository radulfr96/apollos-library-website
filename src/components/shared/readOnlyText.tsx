import React from 'react';
import {
    Typography,
} from '@mui/material';

interface ReadOnlyTextProps {
    text: string | number | Date | undefined;
}

const ReadOnlyText = (props: ReadOnlyTextProps) => {
    const { text } = props;
    return (
        <Typography sx={{ fontSize: '16px' }}>
            {text}
        </Typography>
    );
};

export default ReadOnlyText;

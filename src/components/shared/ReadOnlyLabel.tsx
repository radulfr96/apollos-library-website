import React from 'react';
import {
    Typography,
} from '@mui/material';

interface ReadOnlyLabelProps {
    text: string | undefined;
}

export default function ReadOnlyLabel(props: ReadOnlyLabelProps): JSX.Element {
    return (
        <Typography
            sx={{
                fontSize: '22px',
                paddingTop: '10px',
            }}
        >
            {props.text}
        </Typography>
    );
}

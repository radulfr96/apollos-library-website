import * as React from 'react';
import {
    Typography,
} from '@mui/material';

interface ReadOnlyTextProps {
    text: string | number | Date | undefined;
}

export default function ReadOnlyText(props: ReadOnlyTextProps): JSX.Element {
    return (
        <Typography sx={{ fontSize: '16px' }}>
                {props.text}
        </Typography>
    );
}

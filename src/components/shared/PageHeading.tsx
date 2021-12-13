import React from 'react';
import {
    Typography,
} from '@mui/material';

interface PageHeadingProps {
    headingText: string | undefined;
}

export default function PageHeading(props: PageHeadingProps): JSX.Element {
    return (
        <Typography variant="h3" sx={{ paddingBottom: '20px' }}>
            {props.headingText}
        </Typography>
    );
}

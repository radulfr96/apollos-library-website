import React from 'react';
import {
    Typography,
} from '@mui/material';

interface PageHeadingProps {
    headingText: string | undefined;
}

const PageHeading = (props: PageHeadingProps) => (
    <Typography variant="h3" sx={{ paddingBottom: '20px' }}>
        {props.headingText}
    </Typography>
);

export default PageHeading;

import React from 'react';
import {
    Typography,
} from '@mui/material';

interface PageHeadingProps {
    headingText: string | undefined;
}

const PageHeading = (props: PageHeadingProps) => {
    const { headingText } = props;

    return (
        <Typography variant="h3">
            {headingText}
        </Typography>
    );
};

export default PageHeading;

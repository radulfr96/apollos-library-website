import React from 'react';
import {
    Theme, Typography, makeStyles,
} from '@material-ui/core';

interface PageHeadingProps {
    headingText: string | undefined;
}

const useStyles = makeStyles((theme: Theme) => ({
    heading: {
        ...theme.typography.h4,
        paddingBottom: '20px',
    },
}));

export default function PageHeading(props: PageHeadingProps): JSX.Element {
    const classes = useStyles();

    return (
        <Typography className={classes.heading}>
            {props.headingText}
        </Typography>
    );
}

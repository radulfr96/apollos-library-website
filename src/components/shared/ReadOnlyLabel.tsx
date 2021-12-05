import React from 'react';
import {
    Theme, Typography, makeStyles,
} from '@mui/material';

interface ReadOnlyLabelProps {
    text: string | undefined;
}

const useStyles = makeStyles((theme: Theme) => ({
    text: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '22px',
        paddingTop: '10px',
    },
}));

export default function ReadOnlyLabel(props: ReadOnlyLabelProps): JSX.Element {
    const classes = useStyles();

    return (
        <Typography className={classes.text}>
                {props.text}
        </Typography>
    );
}

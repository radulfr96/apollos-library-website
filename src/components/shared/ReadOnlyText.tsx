import * as React from 'react';
import {
    Theme, Typography, makeStyles,
} from '@mui/material';

interface ReadOnlyTextProps {
    text: string | number | Date | undefined;
}

const useStyles = makeStyles((theme: Theme) => ({
    text: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '16px',
    },
}));

export default function ReadOnlyText(props: ReadOnlyTextProps): JSX.Element {
    const classes = useStyles();

    return (
        <Typography className={classes.text}>
                {props.text}
        </Typography>
    );
}

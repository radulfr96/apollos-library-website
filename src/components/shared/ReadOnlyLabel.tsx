import * as React from 'react';
import {
    withStyles, createStyles, WithStyles, Theme, Typography,
} from '@material-ui/core';

interface ReadOnlyLabelProps {
    text?: string;
    classes?: any;
}

const useStyles = createStyles((theme: Theme) => ({
    text: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '22px',
        paddingTop: '10px',
    },
}));

export class ReadOnlyLabel extends React.Component<
    ReadOnlyLabelProps
    & WithStyles<typeof useStyles>> {
    render() {
        return (
            <>
                <Typography className={this.props.classes.text}>
                    {this.props.text}
                </Typography>
            </>
        );
    }
}

export default withStyles(useStyles)(ReadOnlyLabel);

import * as React from 'react';
import {
    withStyles, createStyles, WithStyles, Theme, Typography,
} from '@material-ui/core';

interface ReadOnlyTextProps {
    text?: string | number | Date | undefined;
    classes?: any;
}

const useStyles = createStyles((theme: Theme) => ({
    text: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '16px',
    },
}));

export class ReadOnlyText extends React.Component<
    ReadOnlyTextProps
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

export default withStyles(useStyles)(ReadOnlyText);

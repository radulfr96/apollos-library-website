import React from 'react';
import {
    withStyles, createStyles, Theme, WithStyles, Typography,
} from '@material-ui/core';

interface PageHeadingProps {
    classes: any;
    headingText?: string;
}

const useStyles = createStyles((theme: Theme) => ({
    heading: {
        ...theme.typography.h4,
        paddingBottom: '20px',
    },
}));

export class PageHeading extends React.Component<PageHeadingProps
& WithStyles<typeof useStyles>> {
    render() {
        return (
            <Typography className={this.props.classes.heading}>
                {this.props.headingText}
            </Typography>
        );
    }
}

export default withStyles(useStyles)(PageHeading);

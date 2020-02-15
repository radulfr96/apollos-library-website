import * as React from 'react';
import {
 WithStyles, Grid, Paper, Typography, createStyles, withStyles,
} from '@material-ui/core';
import { compose } from 'recompose';
import PageHeading from '../../../components/Shared/PageHeading';

interface MyDetailsProps {
    classes: any;
    enqueueSnackbar: any;
    closeSnackbar: any;
}

const useStyles = createStyles({
    paper: {
        paddingTop: '20px',
        paddingLeft: '40px',
        paddingRight: '20px',
    },
    navPaper: {
        paddingTop: '20px',
        paddingLeft: '40px',
        paddingRight: '20px',
        marginRight: '20px',
        width: '150px',
    },
});

export class MyDetails extends React.Component<MyDetailsProps
& WithStyles<typeof useStyles>> {
    render() {
        return (
            <Paper className={this.props.classes.paper}>
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <PageHeading headingText="My Account" />
                </Grid>
                <Grid item xs={12}>
                    <Typography />
                </Grid>
            </Grid>
            </Paper>
        );
    }
}

export default compose<MyDetailsProps, {}>(
    withStyles(useStyles),
)(MyDetails);

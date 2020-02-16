import * as React from 'react';
import {
    WithStyles, Grid, Typography, createStyles, withStyles,
} from '@material-ui/core';
import { compose } from 'recompose';
import PageHeading from '../../../components/shared/PageHeading';

interface UpdatePasswordProps {
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

export class UpdatePassword extends React.Component<UpdatePasswordProps
    & WithStyles<typeof useStyles>> {
    render() {
        return (
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <PageHeading headingText="Update Password" />
                </Grid>
                <Grid item xs={12}>
                    <Typography />
                </Grid>
            </Grid>
        );
    }
}

export default compose<UpdatePasswordProps, {}>(
    withStyles(useStyles),
)(UpdatePassword);

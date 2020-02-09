import * as React from 'react';
import {
 createStyles, WithStyles, Paper, withStyles, Grid,
} from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import PageHeading from '../../components/Shared/PageHeading';

interface MyAccountProps extends RouteComponentProps<{}> {
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
    formButton: {
        marginBottom: '10px',
        marginRight: '10px',
        float: 'right',
    },
});

export class MyAccount extends React.Component<MyAccountProps
& WithStyles<typeof useStyles>
& WithSnackbarProps> {
    constructor(props: MyAccountProps) {
        super(props);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);
    }

    renderErrorSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'error',
        });
    }

    renderSuccessSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'success',
        });
    }

    renderWarningSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'warning',
        });
    }

    render() {
        return (
            <Paper className={this.props.classes.paper}>
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <PageHeading headingText="My Account" />
                    </Grid>
                    <Grid item xs={12}>
                        <div>Test</div>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default compose<MyAccountProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(MyAccount);

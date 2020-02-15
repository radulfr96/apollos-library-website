import * as React from 'react';
import {
    createStyles, WithStyles, Paper, withStyles,
} from '@material-ui/core';
import {
 RouteComponentProps, withRouter,
} from 'react-router';
import { compose } from 'recompose';
import { withSnackbar, WithSnackbarProps } from 'notistack';

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
    navPaper: {
        paddingTop: '20px',
        paddingLeft: '40px',
        paddingRight: '20px',
        marginRight: '20px',
        width: '150px',
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
            <>
                <Paper className={this.props.classes.navPaper}>
                    <p>Test</p>
                </Paper>
                <Paper className={this.props.classes.paper}>
                    {this.props.children}
                </Paper>
            </>
        );
    }
}

export default compose<MyAccountProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(MyAccount);

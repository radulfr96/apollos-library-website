import React from 'react';
import {
    WithStyles, Grid, createStyles, withStyles, Button,
} from '@material-ui/core';
import { compose } from 'recompose';
import Axios from 'axios';
import { withSnackbar } from 'notistack';
import { withRouter, RouteComponentProps } from 'react-router';
import PageHeading from '../../../components/shared/PageHeading';
import ReadOnlyLabel from '../../../components/shared/ReadOnlyLabel';
import ReadOnlyText from '../../../components/shared/ReadOnlyText';
import { AppContext } from '../../../Context';

interface MyDetailsProps extends RouteComponentProps<{}> {
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
    actionButton: {
        marginRight: '10px',
        float: 'right',
    },
});

export class MyDetails extends React.Component<MyDetailsProps
    & WithStyles<typeof useStyles>> {
    constructor(props: MyDetailsProps) {
        super(props);
        this.deactivateUser = this.deactivateUser.bind(this);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);
    }

    deactivateUser() {
        Axios.patch('api/user/deactivate')
            .then((response) => {
                if (response.status === 200) {
                    this.renderSuccessSnackbar('Deactivation successful');
                    this.context.clearUserInfo();
                    this.props.history.push('/');
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    error.response.messages.forEach((message: string) => {
                        this.renderWarningSnackbar(message);
                    });
                } else {
                    this.renderErrorSnackbar('Unable to deactivate account please contact admin');
                }
            });
    }

    deleteUser() {
        Axios.delete('api/user/')
            .then((response) => {
                if (response.status === 200) {
                    this.renderSuccessSnackbar('Deletion successful');
                    this.context.clearUserInfo();
                    this.props.history.push('/');
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    error.response.messages.forEach((message: string) => {
                        this.renderWarningSnackbar(message);
                    });
                } else {
                    this.renderErrorSnackbar('Unable to delete account please contact admin');
                }
            });
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
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <PageHeading headingText="My Details" />
                </Grid>
                <Grid item xs={12}>
                    <ReadOnlyLabel
                        text="User Number"
                    />
                    <ReadOnlyText text={this.context.userInfo?.userId} />
                </Grid>
                <Grid item xs={12}>
                    <ReadOnlyLabel
                        text="Username"
                    />
                    <ReadOnlyText text={this.context.userInfo?.username} />
                </Grid>
                <Grid item xs={12}>
                    <ReadOnlyLabel
                        text="Date Joined"
                    />
                    <ReadOnlyText text={this.context.userInfo?.joinDate} />
                </Grid>
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <Grid item xs={12}>
                            <ReadOnlyLabel
                                text="Roles"
                            />
                        </Grid>
                        {this.context.userInfo?.roles.map((role: string) => (
                            <ReadOnlyText text={role} />
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        onClick={() => {
                            this.deactivateUser();
                        }}
                        variant="contained"
                        color="primary"
                        className={this.props.classes.actionButton}
                    >
                        Deactivate Account
                    </Button>
                    <Button
                        onClick={() => {
                            this.deleteUser();
                        }}
                        className={this.props.classes.actionButton}
                    >
                        Delete Account
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

MyDetails.contextType = AppContext;

export default compose<MyDetailsProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(MyDetails);

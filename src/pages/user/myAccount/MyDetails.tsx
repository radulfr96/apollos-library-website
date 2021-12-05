import React, { useContext } from 'react';
import {
    Grid, Button, makeStyles,
} from '@material-ui/core';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import PageHeading from '../../../components/shared/PageHeading';
import ReadOnlyLabel from '../../../components/shared/ReadOnlyLabel';
import ReadOnlyText from '../../../components/shared/ReadOnlyText';
import { AppContext } from '../../../Context';

const useStyles = makeStyles({
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

export default function MyDetails(): JSX.Element {
    const context = useContext(AppContext);
    const classes = useStyles();
    const history = useNavigate();
    const snackbar = useSnackbar();

    const renderErrorSnackbar = (message: string): void => {
        snackbar.enqueueSnackbar(message, {
            variant: 'error',
        });
    };

    const renderSuccessSnackbar = (message: string): void => {
        snackbar.enqueueSnackbar(message, {
            variant: 'success',
        });
    };

    const renderWarningSnackbar = (message: string): void => {
        snackbar.enqueueSnackbar(message, {
            variant: 'warning',
        });
    };

    const deactivateUser = () => {
        Axios.patch('api/user/deactivate')
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Deactivation successful');
                    context.clearUserInfo();
                    history('/');
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    error.response.messages.forEach((message: string) => {
                        renderWarningSnackbar(message);
                    });
                } else {
                    renderErrorSnackbar('Unable to deactivate account please contact admin');
                }
            });
    };

    const deleteUser = () => {
        Axios.delete('api/user/')
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Deletion successful');
                    context.clearUserInfo();
                    history('/');
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    error.response.messages.forEach((message: string) => {
                        renderWarningSnackbar(message);
                    });
                } else {
                    renderErrorSnackbar('Unable to delete account please contact admin');
                }
            });
    };

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <PageHeading headingText="My Details" />
            </Grid>
            <Grid item xs={12}>
                <ReadOnlyLabel
                    text="User Number"
                />
                <ReadOnlyText text={context.userInfo?.userId} />
            </Grid>
            <Grid item xs={12}>
                <ReadOnlyLabel
                    text="Username"
                />
                <ReadOnlyText text={context.userInfo?.username} />
            </Grid>
            <Grid item xs={12}>
                <ReadOnlyLabel
                    text="Date Joined"
                />
                <ReadOnlyText text={context.userInfo?.joinDate} />
            </Grid>
            <Grid item xs={12}>
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <ReadOnlyLabel
                            text="Roles"
                        />
                    </Grid>
                    {context.userInfo?.roles.map((role: string) => (
                        <ReadOnlyText text={role} />
                    ))}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Button
                    onClick={() => {
                        deactivateUser();
                    }}
                    variant="contained"
                    color="primary"
                    className={classes.actionButton}
                >
                    Deactivate Account
                </Button>
                <Button
                    onClick={() => {
                        deleteUser();
                    }}
                    className={classes.actionButton}
                >
                    Delete Account
                </Button>
            </Grid>
        </Grid>
    );
}

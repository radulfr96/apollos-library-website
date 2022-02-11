import React, { useContext } from 'react';
import {
    Grid, Button,
} from '@mui/material';
import { push } from 'connected-react-router';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import PageHeading from '../../../components/shared/PageHeading';
import ConfigHelper from '../../../config/configHelper';
import { AppContext } from '../../../Context';

const DeactivateAccount = () => {
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);

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
        Axios.patch(`${configHelper.apiUrl}/api/user/deactivate`, {}, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Deactivation successful');
                    context.clearUserInfo();
                    push('/');
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
        Axios.delete(`${configHelper.apiUrl}/api/user/`, {
            headers: {
                Authorization: `Bearer: ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Deletion successful');
                    context.clearUserInfo();
                    push('/');
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
                <PageHeading headingText="Deactivate AccountY" />
            </Grid>
            <Grid item xs={12}>
                <Button
                    onClick={() => {
                        deactivateUser();
                    }}
                    variant="contained"
                    color="primary"
                    sx={{
                        marginRight: '10px',
                        float: 'right',
                    }}
                >
                    Deactivate Account
                </Button>
                <Button
                    onClick={() => {
                        deleteUser();
                    }}
                    sx={{
                        marginRight: '10px',
                        float: 'right',
                    }}
                >
                    Delete Account
                </Button>
            </Grid>
        </Grid>
    );
};

export default DeactivateAccount;

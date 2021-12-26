import React, { useContext, useState } from 'react';
import {
    Grid, Button,
} from '@mui/material';
import Axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import PageHeading from '../../../components/shared/PageHeading';
import { AppContext } from '../../../Context';
import ConfigHelper from '../../../config/configHelper';
import InputTextField from '../../../components/shared/InputTextField';
import UserHelper from '../UserHelper';
import ChangeAccountDetailsInfo from '../../../interfaces/changeAccountDetailsInfo';
import ReadOnlyText from '../../../components/shared/ReadOnlyText';
import ReadOnlyLabel from '../../../components/shared/ReadOnlyLabel';
import userManager from '../../../util/userManager';

interface ChangeAccountDetailsState {
    changeAccountDetailsInfo: ChangeAccountDetailsInfo;
}

const MyDetails = () => {
    const context = useContext(AppContext);
    const configHelper = new ConfigHelper();
    const snackbar = useSnackbar();

    const [detailsState] = useState<ChangeAccountDetailsState>({
        changeAccountDetailsInfo: {
            username: context.userInfo?.username,
        },
    });

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

    const updateDetails = (details: ChangeAccountDetailsInfo, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if ((Object.keys(formKeys).length) === 0) {
                    Axios.patch(`${configHelper.apiUrl}/api/user/selfupdate`, details, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update account details successful');
                                userManager.revokeAccessToken();
                                userManager.signinSilent();
                                context.getUserInfo();
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                error.response.messages.forEach((message: string) => {
                                    renderWarningSnackbar(message);
                                });
                            } else {
                                renderErrorSnackbar('Unable to update your details please try again later or contact admin');
                            }
                        });
                }
            });
    };

    const checkUserIsUnique = (username?: string) => {
        if (username !== undefined) {
            const helper = new UserHelper(context.getToken());

            helper.CheckUsernameIsUnique(username).then((result) => {
                if (result === null || result === undefined) {
                    renderErrorSnackbar('Unable to check username, please contact admin');
                } else if (result === false) {
                    renderWarningSnackbar('Username is taken please choose another');
                } else if (result === true) {
                    renderSuccessSnackbar('Username is availiable');
                }
            });
        } else {
            renderErrorSnackbar('You must have a username.');
        }
    };

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <PageHeading headingText="My Details" />
            </Grid>
            <Formik
                initialValues={detailsState.changeAccountDetailsInfo}
                onSubmit={() => { }}
                validationSchema={
                    yup.object().shape({
                        username: yup.string()
                            .required('You must have username'),
                    })
                }
            >
                {({
                    values,
                    errors,
                    handleChange,
                    validateForm,
                }) => (
                    <Grid item xs={12}>
                        <Grid item xs={12} sx={{ marginBottom: '15px' }}>
                            <ReadOnlyLabel
                                text="Email"
                            />
                            <ReadOnlyText text={context.userInfo?.email} />
                        </Grid>
                        <Grid item xs={12}>
                            <InputTextField
                                label="Username"
                                required
                                type="text"
                                keyName="username"
                                value={values.username}
                                onChange={handleChange}
                                error={!!(errors.username)}
                                errorMessage={errors.username}
                                onBlur={() => {
                                    checkUserIsUnique(values.username);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (errors !== null) {
                                        updateDetails(values, validateForm);
                                    }
                                }}
                            >
                                Update
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Formik>
        </Grid>
    );
};

export default MyDetails;

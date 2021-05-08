import * as React from 'react';
import {
    Grid, Button, makeStyles,
} from '@material-ui/core';
import { Formik } from 'formik';
import * as yup from 'yup';
import Axios from 'axios';
import PageHeading from '../../../components/shared/PageHeading';
import InputTextField from '../../../components/shared/InputTextField';
import ChangeUsernameInfo from '../../../interfaces/changeUsernameInfo';
import UserHelper from '../UserHelper';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../../Context';

interface ChangeUsernameProps {
    enqueueSnackbar: any;
    closeSnackbar: any;
}

interface ChangeUsernameState {
    changeUsernameInfo: ChangeUsernameInfo;
}

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
});

export default function ChangeUsername(props: ChangeUsernameProps): JSX.Element {
    const context = useContext(AppContext);
    const classes = useStyles();
    const history = useHistory();
    
    const [changeUsernameState, setChangeUsernameState] = useState<ChangeUsernameState>({
        changeUsernameInfo: {
            newUsername: '',
            password: '',
        },
    });

    const updateUsername = (usernameInfo: ChangeUsernameInfo, validateForm: Function) => {
        validateForm()
            .then((formKeys: any) => {
                if ((Object.keys(formKeys).length) === 0) {
                    Axios.patch('api/user/username', usernameInfo)
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update username successful');
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                error.response.messages.forEach((message: string) => {
                                    renderWarningSnackbar(message);
                                });
                            } else {
                                renderErrorSnackbar('Unable to update username please contact admin');
                            }
                        });
                }
            });
    }

    const checkUserIsUnique = (username: string) => {
        const helper = new UserHelper();
        helper.CheckUserIsUnique(username).then((result) => {
            if (result === null || result === undefined) {
                renderErrorSnackbar('Unable to check username, please contact admin');
            } else if (result === true) {
                renderWarningSnackbar('Username is taken please choose another');
            } else if (result === false) {
                renderSuccessSnackbar('Username is availiable');
            }
        });
    }

    const renderErrorSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'error',
        });
    }

    const renderSuccessSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'success',
        });
    }

    const renderWarningSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'warning',
        });
    }

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <PageHeading headingText="Change Username" />
            </Grid>
            <Grid item xs={12}>
                <Formik
                    initialValues={changeUsernameState.changeUsernameInfo}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                    validationSchema={
                        yup.object().shape({
                            newUsername: yup.string()
                                .required('You must enter your username to login'),
                            password: yup.string()
                                .required('You must enter your password to login'),
                        })
                    }
                >
                    {({
                        values,
                        errors,
                        handleChange,
                        validateForm,
                    }) => (
                            <Grid container item xs={12}>
                                <Grid item xs={12}>
                                    <InputTextField
                                        label="New Username"
                                        required
                                        type="text"
                                        keyName="newUsername"
                                        value={values.newUsername}
                                        onChange={handleChange}
                                        error={!!(errors.newUsername)}
                                        errorMessage={errors.newUsername}
                                        onBlur={() => {
                                            checkUserIsUnique(values.newUsername);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputTextField
                                        label="Password"
                                        required
                                        type="password"
                                        keyName="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        error={!!(errors.password)}
                                        errorMessage={errors.password}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (errors !== null) {
                                                updateUsername(values, validateForm);
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
        </Grid>
    );
}

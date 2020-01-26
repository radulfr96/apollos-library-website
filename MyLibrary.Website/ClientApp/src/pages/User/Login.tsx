import React from 'react';
import { LoginInfo } from '../../interfaces/loginInfo';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Paper, Grid, TextField } from '@material-ui/core';

interface LoginState {
    loginInfo: LoginInfo;
}

interface LoginProps {

}

class Login extends React.Component<{}, LoginState> {
    constructor(props: LoginProps) {
        super(props);

        this.state = {
            loginInfo: {
                username: "",
                password: "",
            }
        };
    }

    render(): JSX.Element {
        return (
            <Formik
                initialValues={this.state.loginInfo}
                validationSchema={
                    yup.object().shape({
                        username: yup.string()
                            .required("You must enter your username to login"),
                        password: yup.string()
                            .required("You must enter your username to login")
                    })
                }
                onSubmit={() => {

                }}
            > {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
            }) => (
                    <div>
                        <Paper style={{ paddingLeft: '40px', paddingRight: '20px' }}>
                            <Grid container xs={12}>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Username"
                                        variant="outlined"
                                        value={values.username} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Passoword"
                                        variant="outlined"
                                        value={values.password} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </div>
                )}
            </Formik>
        );
    }
}

export default (Login)
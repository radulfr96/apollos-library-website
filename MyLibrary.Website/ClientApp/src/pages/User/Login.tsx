import React from 'react';
import { LoginInfo } from '../../interfaces/loginInfo';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Paper, Grid, Button, WithStyles, withStyles, createStyles } from '@material-ui/core';
import InputTextField from '../../components/InputTextField';
import Axios from 'axios';

interface LoginState {
    loginInfo: LoginInfo;
}

interface LoginProps {
    classes: any;
}

const useStyles = createStyles({
    paper: {
        paddingTop: '20px',
        paddingLeft: '40px', 
        paddingRight: '20px'
    },
    formButton: {
        marginBottom: '10px',
        marginRight: '10px',
        float: 'right',
    }
});

export class Login extends React.Component<LoginProps & WithStyles, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.login = this.login.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            loginInfo: {
                username: "",
                password: "",
            }
        };
    }

    onChange(key: string, value: any): void {
        const prevState = this.state;
        this.setState({
          loginInfo: {
            ...prevState.loginInfo,
            [key]: value
          }
        });
      }

    login(loginInfo: LoginInfo, validateForm: Function): void {
        validateForm()
        .then(() => {
            Axios.post('api/user/login', loginInfo)
            .then ((response) => {
                if (response.status === 200) {

                }
            })
            .catch((response) => {

            })
        });
    }

    render(): JSX.Element {
        return (
            <div>
                <Formik
                    initialValues={this.state.loginInfo}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                    validationSchema={
                        yup.object().shape({
                            username: yup.string()
                                .required("You must enter your username to login"),
                            password: yup.string()
                                .required("You must enter your username to login")
                        })
                    }
                    //className={this.props.classes.formRoot}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        validateForm
                    }) => {
                        return (
                            <Paper className={this.props.classes.paper}>
                                <Grid container item xs={12}>
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label={"Username"}
                                            required={true}
                                            type={"text"}
                                            keyName={"username"}
                                            value={values.username}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={!!(errors.username)}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label={"Password"}
                                            required={true}
                                            type={"password"}
                                            keyName={"password"}
                                            value={values.password} 
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={!!(errors.password)}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                        className={this.props.classes.formButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.login(values, validateForm);
                                        }}>
                                            Login
                                        </Button>
                                        <Button
                                        className={this.props.classes.formButton}
                                        variant="contained"
                                        color="secondary">
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        );
                    }}
                </Formik>
            </div>
        );
    }
}

export default withStyles(useStyles)(Login);
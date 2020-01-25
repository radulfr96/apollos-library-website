import React from 'react';
import { LoginInfo } from '../../interfaces/loginInfo';
import { Formik } from 'formik';
import * as Yup from 'yup';


interface LoginProps {
    loginInfo: LoginInfo;
}

class Login extends React.Component<LoginProps> {
    constructor(props) {
        super(props);

        this.state = {
            username: undefined,
            password: undefined,
        };
    }

    render() {
        return (
            <Formik 
            initialValues={this.state}
            validationSchema={
                Yup.object()
            }
            onSubmit={() => {
                
            }}
            >
                <div>

                </div>
            </Formik>
        )
    }
}
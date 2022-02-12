import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { connect, useStore } from 'react-redux';
import { Box } from '@mui/material';
import { push } from 'connected-react-router';
import userManager from '../util/userManager';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const CallbackPage = () => {
    const store = useStore();

    const goToHome = () => {
        store.dispatch(push('/'));
    };

    return (
        <CallbackComponent
            userManager={userManager}
            successCallback={goToHome}
            errorCallback={goToHome}
        >
            <Box>Redirecting...</Box>
        </CallbackComponent>
    );
};

export default connect()(CallbackPage);

import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Box } from '@mui/material';
import userManager from '../util/userManager';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const CallbackPage = () => {
    const navigateToHome = (): void => {
        push('/');
    };

    return (
        <CallbackComponent
            userManager={userManager}
            successCallback={navigateToHome}
            errorCallback={navigateToHome}
        >
            <Box>Redirecting...</Box>
        </CallbackComponent>
    );
};

export default connect()(CallbackPage);

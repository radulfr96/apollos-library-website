import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { connect } from 'react-redux';
import { Box } from '@mui/material';
import userManager from '../util/userManager';

const CallbackPage = () => {
    const goToHome = () => {
        // eslint-disable-next-line no-restricted-globals
        location.href = '/';
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

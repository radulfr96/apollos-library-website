import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { connect } from 'react-redux';
import { Box } from '@mui/material';
import userManager from '../util/userManager';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const CallbackPage = () => (
    <CallbackComponent
        userManager={userManager}
        successCallback={() => {

        }}
        errorCallback={() => {

        }}
    >
        <Box>Redirecting...</Box>
    </CallbackComponent>
);

export default connect()(CallbackPage);

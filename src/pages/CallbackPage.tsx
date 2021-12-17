import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Box } from '@mui/material';
import { useHistory } from 'react-router';
import userManager from '../util/userManager';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const CallbackPage = () => {
    const history = useHistory();

    // just redirect to '/' in both cases
    return (
        <CallbackComponent
            userManager={userManager}
            successCallback={() => history.push('/')}
            errorCallback={() => {
                push('/');
            }}
        >
            <Box>Redirecting...</Box>
        </CallbackComponent>
    );
};

export default connect()(CallbackPage);

import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Box } from '@mui/material';
import userManager from '../util/userManager';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function CallbackPage(props: any): JSX.Element {
    // just redirect to '/' in both cases
    return (
        <CallbackComponent
            userManager={userManager}
            successCallback={() => props.dispatch(push('/'))}
            errorCallback={(error) => {
                props.dispatch(push('/'));
                console.error(error);
            }}
        >
            <Box>Redirecting...</Box>
        </CallbackComponent>
    );
}

export default connect()(CallbackPage);

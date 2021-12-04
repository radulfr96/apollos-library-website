import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { push } from 'connected-react-router';
import userManager from '../util/userManager';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function CallbackPage(props: any): JSX.Element {
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
            <div>Redirecting...</div>
        </CallbackComponent>
    );
}

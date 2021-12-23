import React, { useState, useEffect } from 'react';
import { UserInfo } from './interfaces/userInfo';
import userManager from './util/userManager';

export const AppContext = React.createContext<State & Functions>({
    userInfo: null,
    isAdmin: () => false,
    isPaidUser: () => false,
    getUserInfo: () => null,
    clearUserInfo: () => null,
    getToken: () => '',
});

interface Functions {
    isAdmin(): boolean;
    isPaidUser(): boolean;
    getUserInfo(): void;
    clearUserInfo(): void;
    getToken(): string | undefined;
}

interface State {
    userInfo: UserInfo | null;
}

interface AppContextProviderProps {
    children: JSX.Element,
}

const AppContextProvider = (props: AppContextProviderProps) => {
    const [state, setState] = useState<State>({
        userInfo: null,
    });

    const isAdmin = (): boolean => {
        if (state.userInfo == null) return false;
        if (state.userInfo.roles === undefined) return false;
        if (state.userInfo.roles.indexOf('administrator') > -1) {
            return true;
        }
        return false;
    };

    const isPaidUser = (): boolean => {
        if (state.userInfo == null) return false;
        if (state.userInfo.roles === undefined) return false;
        if (state.userInfo.roles.indexOf('paidaccount') > -1 || state.userInfo.roles.indexOf('freeaccount') > -1) {
            return true;
        }
        return false;
    };

    const clearUserInfo = () => {
        setState({
            userInfo: null,
        });
    };

    const getToken = () => state.userInfo?.token;

    const getUserInfo = () => {
        userManager.getUser().then((user) => {
            if (user !== null) {
                setState({
                    userInfo: {
                        username: user.profile.username,
                        roles: user.profile.role,
                        userId: user.profile.sid,
                        token: user.access_token,
                        email: user.profile.email,
                    },
                });
            }
        });
    };

    // eslint-disable-next-line react/jsx-no-constructed-context-values
    const contextValue = {
        ...state, isAdmin, isPaidUser, getUserInfo, clearUserInfo, getToken,
    };

    const { children } = props;

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;

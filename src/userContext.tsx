import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import SubscriptionInfo from './interfaces/subscriptionInfo';
import { UserInfo } from './interfaces/userInfo';
import userManager from './util/userManager';
import ConfigHelper from './config/configHelper';
import SubscriptionTypeEnum from './enums/subscriptionTypeEnum';

export const AppContext = React.createContext<State & Functions>({
    userInfo: null,
    isAdmin: () => false,
    isPaidUser: () => false,
    getUserInfo: () => null,
    clearUserInfo: () => null,
    getToken: () => '',
    subscriptionInfo: null,
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
    subscriptionInfo: SubscriptionInfo | null;
}

interface AppContextProviderProps {
    children: JSX.Element,
}

const AppContextProvider = (props: AppContextProviderProps) => {
    const [state, setState] = useState<State>({
        userInfo: null,
        subscriptionInfo: null,
    });

    const isAdmin = (): boolean => {
        if (state.userInfo == null) return false;
        if (state.userInfo.roles === undefined) return false;
        if (state.subscriptionInfo?.subscriptionType === SubscriptionTypeEnum.Staff) {
            return true;
        }
        return false;
    };

    const isPaidUser = (): boolean => {
        if (state.subscriptionInfo == null) return false;
        if (state.subscriptionInfo?.subscriptionType !== SubscriptionTypeEnum.Family
            && state.subscriptionInfo?.subscriptionType !== SubscriptionTypeEnum.Individual
            && state.subscriptionInfo?.subscriptionType !== SubscriptionTypeEnum.Staff
            && ((!state.subscriptionInfo.expiry) || state.subscriptionInfo.expiry < new Date())) {
            return false;
        }
        return true;
    };

    const configHelper = new ConfigHelper();

    const clearUserInfo = () => {
        setState({
            userInfo: null,
            subscriptionInfo: null,
        });
    };

    const getToken = () => state.userInfo?.token;

    const getUserInfo = () => {
        userManager.getUser().then((user) => {
            if (user !== null) {
                Axios.get(`${configHelper.apiUrl}/api/subscription/subscription`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                    },
                })
                    .then((subscription) => {
                        setState({
                            userInfo: {
                                username: user.profile.username,
                                roles: user.profile.role,
                                userId: user.profile.sid,
                                token: user.access_token,
                                email: user.profile.emailaddress,
                            },
                            subscriptionInfo: subscription.data,
                        });
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

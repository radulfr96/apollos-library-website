/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useEffect } from 'react';
// import Axios from 'axios';
import { UserInfo } from './interfaces/userInfo';
import userManager from './util/userManager';

export const AppContext = React.createContext<State & Functions>({
  userInfo: null,
  isAdmin: () => false,
  isPaidUser: () => false,
  getUserInfo: () => null,
  clearUserInfo: () => null,
});

interface Functions {
  isAdmin(): boolean;
  isPaidUser(): boolean;
  getUserInfo(): void;
  clearUserInfo(): void;
}

interface State {
  userInfo: UserInfo | null;
}

interface AppContextProviderProps {
  children: JSX.Element,
}

function AppContextProvider(props: AppContextProviderProps): JSX.Element {
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

  const getUserInfo = () => {
    userManager.getUser().then((user) => {
      if (user !== null) {
        setState({
          userInfo: {
            username: user.profile.username,
            roles: user.profile.role,
            userId: user.profile.sid,
          },
        });
      }
    });
  };

  const contextValue = {
    ...state, isAdmin, isPaidUser, getUserInfo, clearUserInfo,
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;

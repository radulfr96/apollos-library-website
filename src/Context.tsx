/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useEffect } from 'react';
// import Axios from 'axios';
import { UserInfo } from './interfaces/userInfo';
import userManager from './util/userManager';

export const AppContext = React.createContext<State & Functions>({
  userInfo: null,
  isAdmin: () => false,
  isStandardUser: () => false,
  getUserInfo: () => null,
  clearUserInfo: () => null,
});

interface Functions {
  isAdmin(): boolean;
  isStandardUser(): boolean;
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
    if (state.userInfo.roles.indexOf('Admin') > -1) {
      return true;
    }
    return false;
  };

  const isStandardUser = (): boolean => {
    if (state.userInfo == null) return false;
    if (state.userInfo.roles === undefined) return false;
    if (state.userInfo.roles.indexOf('Standard User') > -1) {
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
        console.log(user);
        setState({
          userInfo: {
            username: user.profile.name,
            roles: user.scopes,
            userId: user.profile.sid,
          },
        });
      }
    });
  };

  const contextValue = {
    ...state, isAdmin, isStandardUser, getUserInfo, clearUserInfo,
  };

  useEffect(() => {
    console.log('effect');
    getUserInfo();
  }, []);

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;

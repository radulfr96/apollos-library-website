import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { UserInfo } from './interfaces/userInfo';

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

export const AppContextProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
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
    Axios.get('/api/user/userinfo').then((response) => {
      if (response.data !== null && response.data !== undefined) {
        setState({
          userInfo: {
            username: response.data.username,
            roles: response.data.roles,
            userId: response.data.userID,
            joinDate: response.data.joinDate,
          },
        });
      }
    });
  };

  const contextValue = {
    ...state, isAdmin, isStandardUser, getUserInfo, clearUserInfo,
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

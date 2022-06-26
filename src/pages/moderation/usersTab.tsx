import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { CircularProgress } from '@mui/material';
import ConfigHelper from '../../config/configHelper';
import { User } from '../../interfaces/user';
import { AppContext } from '../../userContext';
import ModerationUsersTable from '../../components/moderationUsersTable';

interface UserssTabState {
    users: Array<User>;
}

const UsersTab = () => {
    const [usersTabState, setUsersTabState] = useState<UserssTabState>({
        users: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);

    const getReports = () => new Promise<void>((resolve) => {
        Axios.get(`${configHelper.idpUrl}/api/user/users`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setUsersTabState({ ...usersTabState, users: response.data.users });
            });
        resolve();
    });

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }
        getReports()
            .then(() => {
                setIsLoading(false);
            });
    }, [context]);

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <ModerationUsersTable users={usersTabState.users} />
    );
};

export default UsersTab;

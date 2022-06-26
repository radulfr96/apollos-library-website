import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { CircularProgress } from '@mui/material';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../userContext';
import ModerationUsersTable from '../../components/moderationUsersTable';
import ModerationUser from '../../interfaces/moderationUser';

interface UserssTabState {
    users: Array<ModerationUser>;
}

const UsersTab = () => {
    const [usersTabState, setUsersTabState] = useState<UserssTabState>({
        users: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);

    const getReports = () => new Promise<void>((resolve) => {
        Axios.get(`${configHelper.apiUrl}/api/moderation/users`, {
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

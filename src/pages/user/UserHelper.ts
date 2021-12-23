import Axios from 'axios';
import { useContext } from 'react';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../Context';

export default class UserHelper {
    static CheckUserIsUnique(username?: string): Promise<boolean | null> {
        const context = useContext(AppContext);

        const configHelper = new ConfigHelper();

        return new Promise<boolean | null>((resolve) => {
            Axios.get(`${configHelper.apiUrl}/api/user/check/${username}`, {
                headers: {
                    Authorization: `Bearer ${context.getToken()}`,
                },
            })
                .then((response) => {
                    resolve(response.data.result);
                });
        });
    }
}

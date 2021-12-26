import Axios from 'axios';
import ConfigHelper from '../../config/configHelper';

export default class UserHelper {
    token?: string;

    constructor(token?: string) {
        this.token = token;
    }

    CheckUsernameIsUnique(username?: string): Promise<boolean | null> {
        const configHelper = new ConfigHelper();

        return new Promise<boolean | null>((resolve) => {
            Axios.get(`${configHelper.apiUrl}/api/user/checkselfusername/${username}`, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            })
                .then((response) => {
                    resolve(response.data.isUnique);
                });
        });
    }
}

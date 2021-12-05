/* eslint-disable arrow-body-style */
import Axios from 'axios';

export default class UserHelper {
    public CheckUserIsUnique(username: string): Promise<boolean | null> {
        return new Promise<boolean | null>((resolve) => {
            Axios.get(`api/user/check/${username}`)
            .then((response) => {
                resolve(response.data.result);
            });
        });
    }
}

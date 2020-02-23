/* eslint-disable arrow-body-style */
import Axios from 'axios';

export default class UserHelper {
    public CheckUserIsUnique(username: string) {
        return new Promise<boolean | null>((resolve) => {
            Axios.get(`api/user/${username}`)
            .then((response) => {
                resolve(response.data.result);
            });
        });
    }
}

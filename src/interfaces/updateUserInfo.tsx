import { Role } from './role';

export interface UpdateUserInfo {
    userID: number;
    username: string;
    password: string | undefined;
    confirmationPassword: string | undefined;
    roles: Array<Role>;
}

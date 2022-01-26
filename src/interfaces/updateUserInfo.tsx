import { Role } from './role';

export interface UpdateUserInfo {
    userID: number;
    username: string;
    roles: Array<Role>;
}

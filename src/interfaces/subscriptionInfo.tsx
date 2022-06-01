import { Guid } from 'guid-typescript';
import SubscriptionTypeEnum from '../enums/subscriptionTypeEnum';

interface SubscriptionInfo {
    subscriptionType: SubscriptionTypeEnum;
    subscriptionName: string;
    joinDate: Date;
    expiry?: Date;
    subscriptionAdmin: boolean;
    subscriptionUsers: Array<SubscriptionUserDTO>;
}

export interface SubscriptionUserDTO {
    email: string;
    userId: Guid;
}

export default SubscriptionInfo;

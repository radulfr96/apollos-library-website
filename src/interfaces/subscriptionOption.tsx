import SubscriptionTypeEnum from '../enums/subscriptionTypeEnum';

interface SubscriptionOption {
    subscriptionType: SubscriptionTypeEnum;
    subscriptionName: string;
    maxUsers: string;
    cost: number;
    priceId: string;
    description: string;
}

export default SubscriptionOption;

import SubscriptionTypeEnum from '../enums/SubscriptionTypeEnum';

interface SubscriptionOption {
    subscriptionType: SubscriptionTypeEnum;
    subscriptionName: string;
    maxUsers: string;
    cost: number;
    priceId: string;
    description: string;
}

export default SubscriptionOption;

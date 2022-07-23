import React, { useEffect, useState } from 'react';
import ProductDisplay from './subscriptions';
import Message from '../../components/subscription/message';
import SubscriptionSuccess from '../../components/subscription/subscriptionSuccess';

const StripeSubscriptionPage = () => {
    const [message, setMessage] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string | null>('');

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);

        if (query.get('success')) {
            setSuccess(true);
            setSessionId(query.get('session_id'));
        }

        if (query.get('canceled')) {
            setSuccess(false);
            setMessage(
                "Subscription process canceled please come back when you're ready.",
            );
        }
    }, [sessionId]);

    if (!success && message === '') {
        return <ProductDisplay />;
    } if (success && sessionId !== '') {
        return <SubscriptionSuccess sessionId={sessionId} />;
    }
    return <Message message={message} />;
};

export default StripeSubscriptionPage;

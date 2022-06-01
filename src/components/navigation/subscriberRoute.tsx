import { useContext } from 'react';
import { useStore } from 'react-redux';
import { push } from 'connected-react-router';
import { AppContext } from '../../userContext';

interface SubscriberRouteProps {
    children: any;
}

const SubscriberRoute = (props: SubscriberRouteProps) => {
    const { children } = props;
    const store = useStore();
    const context = useContext(AppContext);

    if (!context.isPaidUser()) {
        store.dispatch(push('/subscriptions'));
    }
    return children;
};
export default SubscriberRoute;

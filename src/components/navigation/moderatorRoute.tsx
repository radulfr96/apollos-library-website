import { useContext } from 'react';
import { useStore } from 'react-redux';
import { push } from 'connected-react-router';
import { AppContext } from '../../userContext';

interface ModeratorRouteProps {
    children: any;
}

const AdminRoute = (props: ModeratorRouteProps) => {
    const { children } = props;
    const store = useStore();
    const context = useContext(AppContext);

    if (!context.isModerator()) {
        store.dispatch(push('/'));
    }
    return children;
};
export default AdminRoute;

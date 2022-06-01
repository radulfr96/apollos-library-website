import { useContext } from 'react';
import { useStore } from 'react-redux';
import { push } from 'connected-react-router';
import { AppContext } from '../../userContext';

interface AdminRouteProps {
    children: any;
}

const AdminRoute = (props: AdminRouteProps) => {
    const { children } = props;
    const store = useStore();
    const context = useContext(AppContext);

    if (!context.isAdmin()) {
        store.dispatch(push('/'));
    }
    return children;
};
export default AdminRoute;

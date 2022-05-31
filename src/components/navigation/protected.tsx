import { useContext } from 'react';
import { AppContext } from '../../userContext';
import userManager from '../../util/userManager';

interface ProtectedProps {
    children: any;
}

const Protected = (props: ProtectedProps) => {
    const { children } = props;
    const context = useContext(AppContext);

    if (!context.getToken()) {
        userManager.signinRedirect();
    }
    return children;
};
export default Protected;

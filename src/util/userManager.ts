import { createUserManager } from 'redux-oidc';

const userManagerConfig = {
    client_id: 'apolloslibrarywebapp',
    redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`,
    response_type: 'id_token token',
    scope: 'openid offline_access profile email username role apolloslibraryapi IdentityServerApi',
    authority: 'https://localhost:5001',
    silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/silent_renew.html`,
    automaticSilentRenew: true,
    filterProtocolClaims: true,
    loadUserInfo: true,
};

const userManager = createUserManager(userManagerConfig);

export default userManager;

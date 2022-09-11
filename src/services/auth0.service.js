import { Management, WebAuth } from 'auth0-js';

const webAuth = new WebAuth({
    clientID: 'Nl1KOiLDjUgsk8lVts7jRqb3CjisjWzV',
    domain: 'tpick.us.auth0.com',
    audience: `https://tpick.us.auth0.com/api/v2/`,
    scope: 'read:current_user update:current_user_metadata',
    responseType: 'token id_token',
    redirectUri: window.location.origin
});

const triggerWithManagement = (onManagement) => {
    webAuth.checkSession({}, (err, authResult) => {
        if (err) {
            webAuth.authorize();
            return;
        }
        const management = new Management({
            domain: 'tpick.us.auth0.com',
            token: authResult.accessToken
        });

        onManagement(management);
    });
};

export const getUserWithMetadata = (userSub, onUserWithMetadata) => {
    triggerWithManagement((management) => {
        management.getUser(userSub, (err, userWithMetadata) => {
            if (err) return;

            onUserWithMetadata(userWithMetadata);
        });
    });
};

export const patchUserMetadata = (userSub, metadata, cb = () => {}) => {
    getUserWithMetadata(userSub, (userWithMetadata) => {
        triggerWithManagement((management) => {
            management.patchUserMetadata(userSub, { ...userWithMetadata.user_metadata, ...metadata }, () => {});
            cb();
        });
    });
};

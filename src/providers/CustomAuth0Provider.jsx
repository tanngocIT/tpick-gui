import { Auth0Provider, useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setUser } from 'store/auth/actions';
import Loader from 'ui-component/Loader';
import { v5 as uuidv5 } from 'uuid';
import { getUserWithMetadata } from 'services/auth0.service';

const config = {
    domain: 'tpick.us.auth0.com',
    clientId: 'Nl1KOiLDjUgsk8lVts7jRqb3CjisjWzV',
    audience: 'https://tpick.tk',
    redirectUri: window.location.origin
};

const Auth0Wrapper = ({ children }) => {
    const dispatch = useDispatch();
    const { user } = useAuth0();

    useEffect(() => {
        if (!user) return;

        getUserWithMetadata(user.sub, (userWithMetadata) => {
            const enhancedUser = {
                ...user,
                name: userWithMetadata.user_metadata?.name || user.name,
                momo: userWithMetadata.user_metadata?.momo,
                id: uuidv5(user.sub, '073552a3-ebe7-4e3a-ae42-b6608740774e')
            };

            dispatch(setUser(enhancedUser));
        });
    }, [dispatch, user]);

    useEffect(() => {
        if (!user) return;
        if (window.location.search.startsWith('?code=')) {
            window.location.search = '';
        }
    }, [user]);

    return <div>{children}</div>;
};

const EnhancedAuth0Wrapper = withAuthenticationRequired(Auth0Wrapper, {
    onRedirecting: () => <Loader />,
    returnTo: () => window.location.hash.substring(1)
});

const CustomAuth0Provider = ({ children }) => {
    const navigate = useNavigate();

    const onRedirectCallback = (appState) => {
        navigate(appState?.returnTo || window.location.pathname);
    };

    useEffect(() => {
        if (window.location.hash.startsWith('#access_token')) {
            setTimeout(() => {
                window.location.hash = sessionStorage.getItem('auth0-js:redirect') || '';
            }, 200);
        }
    }, []);

    return (
        <Auth0Provider {...config} onRedirectCallback={onRedirectCallback}>
            <EnhancedAuth0Wrapper>{children}</EnhancedAuth0Wrapper>
        </Auth0Provider>
    );
};

export default CustomAuth0Provider;

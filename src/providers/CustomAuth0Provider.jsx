import { Auth0Provider, useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setUser } from 'store/auth/actions';
import Loader from 'ui-component/Loader';
import { v5 as uuidv5 } from 'uuid';

const config = {
    domain: 'tpick.us.auth0.com',
    clientId: 'Nl1KOiLDjUgsk8lVts7jRqb3CjisjWzV',
    redirectUri: window.location.origin,
    audience: 'https://tpick.tk'
};

const Auth0Wrapper = ({ children }) => {
    const dispatch = useDispatch();
    const { user } = useAuth0();

    useEffect(() => {
        if (!user) return;

        const enhancedUser = {
            ...user,
            id: uuidv5(user.sub, '073552a3-ebe7-4e3a-ae42-b6608740774e')
        };

        dispatch(setUser(enhancedUser));
    }, [dispatch, user]);

    return <div>{children}</div>;
};

const EnhancedAuth0Wrapper = withAuthenticationRequired(Auth0Wrapper, {
    onRedirecting: () => <Loader />
});

const CustomAuth0Provider = ({ children }) => {
    const navigate = useNavigate();

    const onRedirectCallback = (appState) => {
        navigate(appState && appState.returnTo ? appState.returnTo : window.location.pathname);
    };

    return (
        <Auth0Provider {...config} onRedirectCallback={onRedirectCallback}>
            <EnhancedAuth0Wrapper>{children}</EnhancedAuth0Wrapper>
        </Auth0Provider>
    );
};

export default CustomAuth0Provider;

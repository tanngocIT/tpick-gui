import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { newConnection } from 'services/hub.service';
import { useDispatch } from 'react-redux';

const HubProvider = ({ children }) => {
    const dispatch = useDispatch();
    const {getAccessTokenSilently} = useAuth0();

    useEffect(() => {
        async function init(){
            const accessToken = await getAccessTokenSilently();
            newConnection(accessToken, dispatch);
        }
        init();
    }, [getAccessTokenSilently, dispatch]);

    return <div>{children}</div>;
};

export default HubProvider;

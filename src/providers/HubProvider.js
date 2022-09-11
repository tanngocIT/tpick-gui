import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { newConnection } from 'services/hub.service';

const HubProvider = ({ children }) => {
    const {getAccessTokenSilently} = useAuth0();

    useEffect(() => {
        async function init(){
            const accessToken = await getAccessTokenSilently();
            newConnection(accessToken);
        }
        init();
    }, [getAccessTokenSilently]);

    return <div>{children}</div>;
};

export default HubProvider;

import { useEffect } from 'react';
import { newConnection } from 'services/hub.service';

const HubProvider = ({ children }) => {
    useEffect(() => {
        newConnection();
    }, []);

    return <div>{children}</div>;
};

export default HubProvider;

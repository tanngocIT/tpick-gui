import { useEffect } from 'react';
import { newConnection } from 'services/hub.service';
import { useDispatch, useSelector } from 'react-redux';
import * as jwt from 'jsonwebtoken';

const HubProvider = ({ children }) => {
    const dispatch = useDispatch();
    const user = useSelector((x) => x.auth?.user);

    useEffect(() => {
        if (!user) return;

        const secret = 'just_a_simple_secret';
        const accessToken = jwt.sign(user, secret, {
            expiresIn: '360d',
            audience: 'https://tpick.tk',
            issuer: 'https://tpick.us.auth0.com/'
        });
        newConnection(accessToken, dispatch);

    }, [dispatch, user]);

    return <div>{children}</div>;
};

export default HubProvider;

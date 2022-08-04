import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

const TeamCart = Loadable(lazy(() => import('views/team-cart')));
const InitOrder = Loadable(lazy(() => import('views/init-order')));
const OrderDetails = Loadable(lazy(() => import('views/order-details')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <InitOrder />
        },
        {
            path: 'init-order',
            element: <InitOrder />
        },
        {
            path: 'team-cart/:orderId',
            element: <TeamCart />
        },
        {
            path: 'order-details/:orderId',
            element: <OrderDetails />
        }
    ]
};

export default MainRoutes;

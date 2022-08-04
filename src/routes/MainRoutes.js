import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

const OrderCart = Loadable(lazy(() => import('views/orders/cart')));
const OrderInit = Loadable(lazy(() => import('views/orders/init')));
const OrderDetails = Loadable(lazy(() => import('views/orders/details')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <OrderInit />
        },
        {
            path: 'orders/init',
            element: <OrderInit />
        },
        {
            path: 'orders/:orderId/cart',
            element: <OrderCart />
        },
        {
            path: 'orders/:orderId/details',
            element: <OrderDetails />
        }
    ]
};

export default MainRoutes;

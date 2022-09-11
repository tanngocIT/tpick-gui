import { useRoutes } from 'react-router-dom';

import MainRoutes from './MainRoutes';
// import AuthenticationRoutes from './AuthenticationRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const Routes = () => {
    return useRoutes([MainRoutes]);
};

export default Routes;

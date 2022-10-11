import customizationReducer from './customization/reducer';
import authReducer from './auth/reducer';
import liveOrderReducer from './liveOrder/reducer';
import hubReducer from './hub/reducer';

const reducer = ({
    auth: authReducer,
    liveOrder: liveOrderReducer,
    customization: customizationReducer,
    hub: hubReducer
});

export default reducer;

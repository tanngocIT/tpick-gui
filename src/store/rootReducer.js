import customizationReducer from './customization/reducer';
import authReducer from './auth/reducer';
import liveOrderReducer from './liveOrder/reducer';

const reducer = ({
    auth: authReducer,
    liveOrder: liveOrderReducer,
    customization: customizationReducer
});

export default reducer;

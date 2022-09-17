import customizationReducer from './customization/customizationReducer';
import authReducer from './auth/reducer';

const reducer = ({
    auth: authReducer,
    customization: customizationReducer
});

export default reducer;

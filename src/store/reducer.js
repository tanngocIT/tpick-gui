import { combineReducers } from 'redux';

import customizationReducer from './customization/customizationReducer';
import authReducer from './auth/reducer';

const reducer = combineReducers({
    auth: authReducer,
    customization: customizationReducer
});

export default reducer;

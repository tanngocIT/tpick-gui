import * as actionTypes from './actions';

const getInitialState = () => {
    try {
        return JSON.parse(localStorage.getItem('authState'));
    } catch (error) {
        return {
            user: null
        };
    }
};

const authReducer = (state = getInitialState(), action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            state = {
                ...state,
                user: action.user
            };
            break;
        case actionTypes.CLEAR_USER:
            state = {
                ...state,
                user: null
            };
            break;
        default:
            return state;
    }

    localStorage.setItem('authState', JSON.stringify(state));

    return state;
};

export default authReducer;

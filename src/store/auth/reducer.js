import * as actionTypes from './actions';
import { createReducer } from '@reduxjs/toolkit';

const initState = {
    user: null
};
const getInitialState = () => {
    try {
        return JSON.parse(localStorage.getItem('authState')) || initState;
    } catch (error) {
        return initState;
    }
};

const authReducer = createReducer(getInitialState(), {
    [actionTypes.SET_USER]: (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem('authState', JSON.stringify(state));
    },
    [actionTypes.CLEAR_USER]: (state) => {
        state.user = null;
        localStorage.setItem('authState', JSON.stringify(state));
    }
});

export default authReducer;

import * as actionTypes from './actions';
import { createReducer } from '@reduxjs/toolkit';

const getInitialState = () => {
    try {
        return JSON.parse(localStorage.getItem('authState'));
    } catch (error) {
        return {
            user: null
        };
    }
};

const authReducer = createReducer(getInitialState(), {
    [actionTypes.SET_USER]: (state, action) => {
        state.user = action.payload;
        localStorage.setItem('authState', JSON.stringify(state));
    },
    [actionTypes.CLEAR_USER]: (state) => {
        state.user = null;
        localStorage.setItem('authState', JSON.stringify(state));
    }
});

export default authReducer;

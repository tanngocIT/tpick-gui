import * as actionTypes from './actions';
import { createReducer } from '@reduxjs/toolkit';

const initState = {
    state: 'null',
    groupNames: []
};

const reducer = createReducer(initState, {
    [actionTypes.ADD_TO_HUB_GROUP]: (state, action) => {
        if (!state.groupNames.includes(action.payload.groupName)) {
            state.groupNames.push(action.payload.groupName);
        }
    },
    [actionTypes.REMOVE_FROM_HUB_GROUP]: (state, action) => {
        state.groupNames = state.groupNames.filter((groupName) => groupName !== action.payload.groupName);
    },
    [actionTypes.SET_HUB_STATE]: (state, action) => {
        state.state = action.payload.state;
    },
});

export default reducer;

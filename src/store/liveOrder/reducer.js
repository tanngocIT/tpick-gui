import * as actionTypes from './actions';
import { createReducer } from '@reduxjs/toolkit';

const initState = {
    order: {},
    shop: {},
    lastRefreshed: null,
};
const liveOrderReducer = createReducer(initState, {
    [actionTypes.GET_LIVE_ORDER_SUCCESS]: (state, action) => {
        state.order = action.payload.shop;
    },
    [actionTypes.GET_LIVE_SHOP_SUCCESS]: (state, action) => {
        state.shop = action.payload.shop;
    }
});

export default liveOrderReducer;

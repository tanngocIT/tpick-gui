import * as actionTypes from './actions';
import { createReducer } from '@reduxjs/toolkit';

const initState = {
    shop: {},
    order: { id: null, subOrders: [] },
    mySubOrder: { items: [], using: false, confirmed: false, note: '' },
    lastRefreshed: null
};
const liveOrderReducer = createReducer(initState, {
    [actionTypes.RESET_LIVE_ORDER_SUCCESS]: () => initState,
    [actionTypes.GET_LIVE_ORDER_SUCCESS]: (state, action) => {
        state.order = action.payload.order;
    },
    [actionTypes.GET_LIVE_SHOP_SUCCESS]: (state, action) => {
        state.shop = action.payload.shop;
    },
    [actionTypes.NOTICE_ORDER_REFRESHED_SUCCESS]: (state, action) => {
        state.lastRefreshed = action.payload.lastRefreshed;
    },
    [actionTypes.CONFIRM_LIVE_ORDER_SUCCESS]: (state) => {
        state.order.isConfirm = true;
    },
    [actionTypes.REVERT_LIVE_ORDER_SUCCESS]: (state) => {
        state.order.isConfirm = false;
    },
    [actionTypes.ADD_ITEM_TO_SUB_ORDER_SUCCESS]: (state, action) => {
        const { mySubOrder } = state;
        const { item } = action.payload;

        const existingItem = mySubOrder.items.find((x) => x.name === item.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            mySubOrder.items.push({ ...item, quantity: 1 });
        }
        mySubOrder.using = true;
    },
    [actionTypes.MINUS_ITEM_FROM_SUB_ORDER_SUCCESS]: (state, action) => {
        const { mySubOrder } = state;
        const { item } = action.payload;

        const existingItem = mySubOrder.items.find((x) => x.name === item.name);
        if (!existingItem) return;

        existingItem.quantity -= 1;
        if (existingItem.quantity <= 0) {
            mySubOrder.items = mySubOrder.items.filter((x) => x.name !== item.name);
        }
        mySubOrder.using = true;
    },
    [actionTypes.SET_MY_SUB_ORDER_NOTE]: (state, action) => {
        const { note } = action.payload;
        state.mySubOrder.note = note;
    },
    [actionTypes.SUBMIT_SUB_ORDER_SUCCESS]: (state) => {
        const { order, mySubOrder } = state;
        mySubOrder.confirmed = true;
        order.subOrders.push(mySubOrder);
    },
    [actionTypes.REMOVE_SUB_ORDER_SUCCESS]: (state, action) => {
        const { order, mySubOrder } = state;
        const { ownerId } = action.payload;
        order.subOrders = order.subOrders.filter((x) => x.owner.id !== ownerId);

        if (ownerId === mySubOrder.owner.id) {
            state.mySubOrder = { ...mySubOrder, items: [], using: false, confirmed: false, note: '' };
        }
    },
    [actionTypes.INIT_MY_SUB_ORDER_SUCCESS]: (state, action) => {
        const { mySubOrder } = action.payload;
        state.mySubOrder = mySubOrder;
    }
});

export default liveOrderReducer;

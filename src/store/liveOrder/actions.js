import { createAction } from '@reduxjs/toolkit';

export const GET_LIVE_ORDER = '@liveOrder/GET_LIVE_ORDER';
export const GET_LIVE_ORDER_SUCCESS = '@liveOrder/GET_LIVE_ORDER_SUCCESS';
export const GET_LIVE_SHOP = '@liveOrder/GET_LIVE_SHOP';
export const GET_LIVE_SHOP_SUCCESS = '@liveOrder/GET_LIVE_SHOP_SUCCESS';
export const RESET_LIVE_ORDER_SUCCESS = '@liveOrder/RESET_LIVE_ORDER_SUCCESS';
export const INIT_MY_SUB_ORDER = '@liveOrder/INIT_MY_SUB_ORDER';
export const INIT_MY_SUB_ORDER_SUCCESS = '@liveOrder/INIT_MY_SUB_ORDER_SUCCESS';
export const CONFIRM_LIVE_ORDER = '@liveOrder/CONFIRM_LIVE_ORDER';
export const CONFIRM_LIVE_ORDER_SUCCESS = '@liveOrder/CONFIRM_LIVE_ORDER_SUCCESS';
export const ADD_ITEM_TO_SUB_ORDER = '@liveOrder/ADD_ITEM_TO_SUB_ORDER';
export const ADD_ITEM_TO_SUB_ORDER_SUCCESS = '@liveOrder/ADD_ITEM_TO_SUB_ORDER_SUCCESS';
export const MINUS_ITEM_FROM_SUB_ORDER = '@liveOrder/MINUS_ITEM_FROM_SUB_ORDER';
export const MINUS_ITEM_FROM_SUB_ORDER_SUCCESS = '@liveOrder/MINUS_ITEM_FROM_SUB_ORDER_SUCCESS';
export const SET_MY_SUB_ORDER_NOTE = '@liveOrder/SET_MY_SUB_ORDER_NOTE';
export const SUBMIT_SUB_ORDER = '@liveOrder/SUBMIT_SUB_ORDER';
export const SUBMIT_SUB_ORDER_SUCCESS = '@liveOrder/SUBMIT_SUB_ORDER_SUCCESS';
export const REMOVE_SUB_ORDER = '@liveOrder/REMOVE_SUB_ORDER';
export const REMOVE_SUB_ORDER_SUCCESS = '@liveOrder/REMOVE_SUB_ORDER_SUCCESS';
export const NOTICE_ORDER_REFRESHED = '@liveOrder/NOTICE_ORDER_REFRESHED';
export const NOTICE_ORDER_REFRESHED_SUCCESS = '@liveOrder/NOTICE_ORDER_REFRESHED_SUCCESS';

export const getLiveOrder = createAction(GET_LIVE_ORDER, (orderId) => ({ payload: { orderId } }));
export const getLiveOrderSuccess = createAction(GET_LIVE_ORDER_SUCCESS, (order) => ({ payload: { order } }));
export const getLiveShop = createAction(GET_LIVE_SHOP, (shopId) => ({ payload: { shopId } }));
export const getLiveShopSuccess = createAction(GET_LIVE_SHOP_SUCCESS, (shop) => ({ payload: { shop } }));
export const noticeOrderRefreshed = createAction(NOTICE_ORDER_REFRESHED);
export const noticeOrderRefreshedSuccess = createAction(NOTICE_ORDER_REFRESHED_SUCCESS, (lastRefreshed) => ({
    payload: { lastRefreshed }
}));
export const confirmLiveOrder = createAction(CONFIRM_LIVE_ORDER);
export const submitSubOrder = createAction(SUBMIT_SUB_ORDER);
export const submitSubOrderSuccess = createAction(SUBMIT_SUB_ORDER_SUCCESS);
export const removeSubOrder = createAction(REMOVE_SUB_ORDER, (ownerId) => ({ payload: { ownerId } }));
export const removeSubOrderSuccess = createAction(REMOVE_SUB_ORDER_SUCCESS, (ownerId) => ({ payload: { ownerId } }));
export const addItemToSubOrder = createAction(ADD_ITEM_TO_SUB_ORDER, (item) => ({ payload: { item } }));
export const addItemToSubOrderSuccess = createAction(ADD_ITEM_TO_SUB_ORDER_SUCCESS, (item) => ({ payload: { item } }));
export const minusItemFromSubOrder = createAction(MINUS_ITEM_FROM_SUB_ORDER, (item) => ({ payload: { item } }));
export const minusItemFromSubOrderSuccess = createAction(MINUS_ITEM_FROM_SUB_ORDER_SUCCESS, (item) => ({ payload: { item } }));
export const initMySubOrder = createAction(INIT_MY_SUB_ORDER);
export const initMySubOrderSuccess = createAction(INIT_MY_SUB_ORDER_SUCCESS, (mySubOrder) => ({ payload: { mySubOrder } }));
export const setMySubOrderNote = createAction(SET_MY_SUB_ORDER_NOTE, (note) => ({ payload: { note } }));
export const resetLiveOrderSuccess = createAction(RESET_LIVE_ORDER_SUCCESS);
import { createAction } from '@reduxjs/toolkit';

export const GET_LIVE_ORDER = '@liveOrder/GET_LIVE_ORDER';
export const GET_LIVE_ORDER_SUCCESS = '@liveOrder/GET_LIVE_ORDER_SUCCESS';
export const GET_LIVE_SHOP = '@liveOrder/GET_LIVE_SHOP';
export const GET_LIVE_SHOP_SUCCESS = '@liveOrder/GET_LIVE_SHOP_SUCCESS';

export const getLiveOrder = createAction(GET_LIVE_ORDER, (orderId) => ({ payload: { orderId } }));
export const getLiveOrderSuccess = createAction(GET_LIVE_ORDER_SUCCESS, (order) => ({ payload: { order } }));
export const getLiveShop = createAction(GET_LIVE_SHOP, (shopId) => ({ payload: { shopId } }));
export const getLiveShopSuccess = createAction(GET_LIVE_SHOP_SUCCESS, (shop) => ({ payload: { shop } }));

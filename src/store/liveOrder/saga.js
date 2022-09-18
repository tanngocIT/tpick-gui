import { call, put, takeLatest } from 'redux-saga/effects';
import { getOrderDetails, getShopDetails } from 'services/main.service';
import * as actions from './actions';
import * as customizationActions from '../customization/actions';

function* getLiveOrderHandler({ payload }) {
    const { orderId } = payload;
    const order = yield call(getOrderDetails, orderId);
    yield put(actions.getLiveOrderSuccess(order));
}

function* getLiveShopHandler({ payload }) {
    const { shopId } = payload;
    const shop = yield call(getShopDetails, shopId);
    yield put(actions.getLiveShopSuccess(shop));
}

function* noticeOrderRefreshedHandler() {
    yield put(actions.noticeOrderRefreshedSuccess(new Date()));
}

export function* liveOrderSaga() {
    yield takeLatest(actions.getLiveOrder, getLiveOrderHandler);
    yield takeLatest(actions.getLiveShop, getLiveShopHandler);
    yield takeLatest(actions.noticeOrderRefreshed, noticeOrderRefreshedHandler);
}

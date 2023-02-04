import { select, call, put, takeLatest } from 'redux-saga/effects';
import * as mainService from 'services/main.service';
import * as actions from './actions';
import * as customizationActions from '../customization/actions';

function* noticeOrderRefreshedHandler() {
    yield put(actions.noticeOrderRefreshedSuccess(new Date()));
}

function* getLiveOrderHandler({ payload }) {
    const { orderId } = payload;
    const { user } = yield select((x) => x.auth);
    const order = yield call(mainService.getOrderDetails, orderId);
    yield put(actions.getLiveOrderSuccess(order));

    const { shop } = yield select((x) => x.liveOrder);
    if (!shop.id) {
        yield put(actions.getLiveShop(order.shopId));
    }

    let overrideMySubOrder = {};

    const mySubOrder = yield select((x) => x.liveOrder.mySubOrder);
    if (!mySubOrder.owner) {
        overrideMySubOrder = {
            ...overrideMySubOrder,
            owner: {
                id: user.id,
                name: user.name
            }
        };
    }

    const myConfirmedSubOrder = order?.subOrders?.find((x) => x.owner?.id === user?.id);
    if (!myConfirmedSubOrder && mySubOrder.confirmed) {
        overrideMySubOrder = {
            ...overrideMySubOrder,
            items: [],
            using: false,
            confirmed: false
        };
        yield put(customizationActions.enqueueSnackbar(`Đặt hàng của bạn đã bị hủy`, { variant: 'warning', persist: true }));
    } else if (myConfirmedSubOrder && !mySubOrder.using) {
        overrideMySubOrder = {
            ...overrideMySubOrder,
            ...myConfirmedSubOrder,
            using: false,
            confirmed: true
        };
    }

    if (Object.keys(overrideMySubOrder).length > 0) {
        yield put(actions.initMySubOrderSuccess({ ...mySubOrder, ...overrideMySubOrder }));
    }
}

function* getLiveShopHandler({ payload }) {
    const { shopId } = payload;
    const shop = yield call(mainService.getShopDetails, shopId);
    yield put(actions.getLiveShopSuccess(shop));
}

function* addItemToSubOrderHandler({ payload }) {
    const { item } = payload;
    yield put(actions.addItemToSubOrderSuccess(item));
    yield put(customizationActions.enqueueSnackbar(`+1 ${item.name}`, { variant: 'success' }));
}

function* minusItemFromSubOrderHandler({ payload }) {
    const { item } = payload;
    yield put(actions.minusItemFromSubOrderSuccess(item));
    yield put(customizationActions.enqueueSnackbar(`-1 ${item.name}`, { variant: 'info' }));
}

function* submitSubOrderHandler() {
    const { user } = yield select((x) => x.auth);
    const { order, mySubOrder } = yield select((x) => x.liveOrder);
    const fullSubOrder = {
        ...mySubOrder,
        owner: {
            id: user.id,
            name: user.name
        }
    };
    yield call(mainService.submitSubOrder, order.id, fullSubOrder);
    yield put(actions.submitSubOrderSuccess());
}

function* removeSubOrderHandler({ payload }) {
    const { order } = yield select((x) => x.liveOrder);
    const { ownerId } = payload;
    yield call(mainService.removeSubOrder, order.id, ownerId);
    yield put(actions.removeSubOrderSuccess(ownerId));
}

function* confirmLiveOrderHandler() {
    const { order } = yield select((x) => x.liveOrder);
    yield call(mainService.confirmOrder, order.id);
    yield put(actions.confirmLiveOrderSuccess());
}

function* revertLiveOrderHandler() {
    const { order } = yield select((x) => x.liveOrder);
    yield call(mainService.revertOrder, order.id);
    yield put(actions.revertLiveOrderSuccess());
}

export function* sagas() {
    yield takeLatest(actions.getLiveOrder, getLiveOrderHandler);
    yield takeLatest(actions.getLiveShop, getLiveShopHandler);
    yield takeLatest(actions.noticeOrderRefreshed, noticeOrderRefreshedHandler);
    yield takeLatest(actions.addItemToSubOrder, addItemToSubOrderHandler);
    yield takeLatest(actions.minusItemFromSubOrder, minusItemFromSubOrderHandler);
    yield takeLatest(actions.submitSubOrder, submitSubOrderHandler);
    yield takeLatest(actions.removeSubOrder, removeSubOrderHandler);
    yield takeLatest(actions.confirmLiveOrder, confirmLiveOrderHandler);
    yield takeLatest(actions.revertLiveOrder, revertLiveOrderHandler);
}

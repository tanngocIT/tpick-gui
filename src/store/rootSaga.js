import { all } from 'redux-saga/effects';
import { sagas as liveOrderSagas } from './liveOrder/sagas';
import { sagas as hubSagas } from './hub/sagas';

export default function* rootSaga() {
    yield all([liveOrderSagas(), hubSagas()]);
}

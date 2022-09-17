import { all } from 'redux-saga/effects';
import { liveOrderSaga } from './liveOrder/saga';


export default function* rootSaga() {
  yield all([liveOrderSaga()]);
}
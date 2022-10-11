import { select, call, takeLatest, takeLeading } from 'redux-saga/effects';
import * as actions from './actions';
import { addToGroup } from 'services/hub.service';

function* setHubStateHandler({ payload }) {
    const { state } = payload;
    if (state === 'reconnected') {
        const groupNames = yield select((x) => x.hub.groupNames);
        // eslint-disable-next-line no-restricted-syntax
        for (const groupName of groupNames) {
            yield call(addToGroup, groupName);
        }
    }
}

function* addToHubGroupHandler({ payload }) {
    const { groupName } = payload;

    yield call(addToGroup, groupName);
}

export function* sagas() {
    yield takeLeading(actions.ADD_TO_HUB_GROUP, addToHubGroupHandler);
    yield takeLatest(actions.SET_HUB_STATE, setHubStateHandler);
}

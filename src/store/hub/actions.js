import { createAction } from '@reduxjs/toolkit';

export const SET_HUB_STATE = '@hub/SET_HUB_STATE';
export const ADD_TO_HUB_GROUP = '@HUB/ADD_TO_HUB_GROUP';
export const REMOVE_FROM_HUB_GROUP = '@HUB/REMOVE_FROM_HUB_GROUP';

export const setHubState = createAction(SET_HUB_STATE, (state) => ({ payload: { state } }));
export const addToGroup = createAction(ADD_TO_HUB_GROUP, (groupName) => ({ payload: { groupName } }));
export const removeFromGroup = createAction(REMOVE_FROM_HUB_GROUP, (groupName) => ({ payload: { groupName } }));

import { createReducer } from '@reduxjs/toolkit';
import * as actionTypes from './actions';
import config from 'config';

export const initialState = {
    isOpen: [], // for active default menu
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    snackBarMessage: null,
};

const customizationReducer = createReducer(initialState, {
    [actionTypes.MENU_OPEN]: (state, action) => {
        state.isOpen = [action.id];
    },
    [actionTypes.SET_MENU]: (state, action) => {
        state.opened = action.opened;
    },
    [actionTypes.SET_FONT_FAMILY]: (state, action) => {
        state.fontFamily = action.fontFamily;
    },
    [actionTypes.SET_BORDER_RADIUS]: (state, action) => {
        state.borderRadius = action.borderRadius;
    },
    [actionTypes.ENQUEUE_SNACK_BAR]: (state, action) => {
        state.snackBarMessage = action.payload;
    }
});

export default customizationReducer;

import { createAction } from '@reduxjs/toolkit';

export const SET_USER = '@auth/SET_USER';
export const CLEAR_USER = '@auth/CLEAR_USER';

export const setUser = createAction(SET_USER, (user) => ({ payload: { user } }));
export const clearUser = createAction(CLEAR_USER);

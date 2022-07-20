export const SET_USER = '@auth/SET_USER';
export const CLEAR_USER = '@auth/CLEAR_USER';

export const setUser = (user) => ({ type: SET_USER, user });
export const clearUser = () => ({ type: CLEAR_USER });

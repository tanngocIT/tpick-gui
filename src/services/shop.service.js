import { HTTP_CODE, get, is2xxCode } from './api.service';

export const getShopDetails = async (shopId) => {
    const { status, data } = await get(`/shops/${shopId}`);
    if (is2xxCode(status)) return data;

    throw new Error('Something went wrong!');
};

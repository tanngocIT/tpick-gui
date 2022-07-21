import { get, is2xxCode, post, del } from './api.service';

export const addOrUpdateShop = async (shopUrl) => {
    const { status, data } = await post(`/shops`, { shopUrl });
    if (is2xxCode(status)) return data;

    throw new Error('Something went wrong!');
};

export const getShopDetails = async (shopId) => {
    const { status, data } = await get(`/shops/${shopId}`);
    if (is2xxCode(status)) return data;

    throw new Error('Something went wrong!');
};

export const initOrder = async (shopId, host) => {
    const { status, data } = await post(`/orders`, { shopId, host });
    if (is2xxCode(status)) return data;

    throw new Error('Something went wrong!');
};

export const getOrderDetails = async (id) => {
    const { status, data } = await get(`/orders/${id}`);
    if (is2xxCode(status)) return data;

    throw new Error('Something went wrong!');
};

export const submitSubOrder = async (orderId, subOrder) => {
    const { status, data } = await post(`/orders/${orderId}/sub-orders`, subOrder);
    if (is2xxCode(status)) return data;

    throw new Error('Something went wrong!');
};

export const removeSubOrder = async (orderId, ownerId) => {
    const { status, data } = await del(`/orders/${orderId}/sub-orders/${ownerId}`);
    if (is2xxCode(status)) return data;

    throw new Error('Something went wrong!');
};

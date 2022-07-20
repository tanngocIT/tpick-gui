import axios from 'axios';
import axiosRetry from 'axios-retry';

axios.defaults.baseURL = process.env.REACT_APP_BASE_API;
const axiosOnce = axios.create();

axiosRetry(axios, {
    retries: 1,
    retryDelay: (retryCount) => retryCount * 1000
});

const buildErrorResponse = (error) => {
    return {
        error: true,
        data: error.response && error.response.data ? error.response.data : error.message,
        status: error.response && error.response.status ? error.response.status : -1
    };
};

const getClient = (retry) => (retry ? axios : axiosOnce);

export const HTTP_CODE = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL: 500
};

const handleErrorResponse = (error) => {
    return buildErrorResponse(error);
};

export const is2xxCode = (status) => {
    return Math.round(status / 100) === 2;
};

export const is4xxCode = (status) => {
    return Math.round(status / 100) === 4;
};

export const get = async (link, headers = {}, retry = true) => {
    return getClient(retry)
        .get(link, { headers, withCredentials: true })
        .then((response) => response)
        .catch((error) => handleErrorResponse(error, link));
};

export const post = async (link, data, headers = {}, retry = true) => {
    return getClient(retry)
        .post(link, data, { headers, withCredentials: true })
        .then((response) => response)
        .catch((error) => handleErrorResponse(error, link));
};

export const put = async (link, data, headers = {}, retry = true) => {
    return getClient(retry)
        .put(link, data, { headers, withCredentials: true })
        .then((response) => response)
        .catch((error) => handleErrorResponse(error, link));
};

export const patch = async (link, data, headers = {}, retry = true) => {
    return getClient(retry)
        .patch(link, data, { headers, withCredentials: true })
        .then((response) => response)
        .catch((error) => handleErrorResponse(error, link));
};

export const del = async (link, headers = {}, retry = true) => {
    return getClient(retry)
        .delete(link, { headers, withCredentials: true })
        .then((response) => response)
        .catch((error) => handleErrorResponse(error, link));
};

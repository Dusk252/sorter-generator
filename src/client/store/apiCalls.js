import axios from 'axios';
import jsonToFormData from 'json-form-data';

const publicCall = (method, url, body) => {
    return axios({
        method,
        url,
        data: body,
        responseType: 'json'
    });
};

const privateCall = (method, url, body, accessToken, extraHeaders = {}) => {
    return axios({
        method,
        url,
        data: body,
        headers: { Authorization: accessToken, ...extraHeaders },
        responseType: 'json'
    });
};

export const refreshToken = () => {
    return publicCall('POST', '/api/auth/refresh-token', '');
};

export const localLogin = (email, password) => {
    return publicCall('POST', '/api/auth/login', { email, password });
};

export const requestList = (name, page, accessToken = null) => {
    if (accessToken) return privateCall('POST', `/api/${name}`, { page }, accessToken);
    else return publicCall('POST', `/api/${name}`, { page });
};

export const createSorter = (sorter, accessToken) => {
    return privateCall(
        'POST',
        '/api/sorters/create',
        jsonToFormData(sorter /*, { showLeafArrayIndexes: false }*/),
        accessToken,
        {
            'Content-Type': 'multipart/form-data'
        }
    );
};

export const getSorterById = (id, getUserInfo = false) => {
    return publicCall('POST', `/api/sorters/${id}`, { getUserInfo });
};

export const incrementSorterViews = (id) => {
    return publicCall('POST', '/api/sorters/viewCount', { id });
};

export const saveSorterResult = (result, accessToken) => {
    if (accessToken) return privateCall('POST', '/api/sorter_results/new', { result }, accessToken);
    else return publicCall('POST', '/api/sorter_results/new', { result });
};

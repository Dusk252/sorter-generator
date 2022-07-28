import axios from 'axios';
import jsonToFormData from 'json-form-data';

const publicCall = (method, url, body) => {
    return axios({
        method,
        url,
        data: body,
        responseType: 'json',
        timeout: 5000
    });
};

const privateCall = (method, url, body, accessToken, extraHeaders = {}) => {
    return axios({
        method,
        url,
        data: body,
        headers: { Authorization: accessToken, ...extraHeaders },
        responseType: 'json',
        timeout: 5000
    });
};

export const refreshToken = () => {
    return publicCall('POST', '/api/auth/refresh-token', '');
};

export const localLogin = (email, password) => {
    return publicCall('POST', '/api/auth/login', { email, password });
};

export const logout = () => {
    return privateCall('POST', '/api/auth/logout', '');
}

export const requestList = (name, count, lastUpdated, accessToken = null) => {
    if (accessToken) return privateCall('POST', `/api/${name}`, { count, lastUpdated }, accessToken);
    else return publicCall('POST', `/api/${name}`, { count, lastUpdated });
};

// export const checkList = (name, lastUpdated, accessToken = null) => {
//     if (accessToken) return privateCall('POST', `/api/${name}/checkNew`, { lastUpdated }, accessToken);
//     else return publicCall('POST', `/api/${name}/checkNew`, { lastUpdated });
// };

export const requestListUpdate = (name, count, lastUpdated, accessToken = null) => {
    if (accessToken) return privateCall('POST', `/api/${name}/getUpdate`, { count, lastUpdated }, accessToken);
    else return publicCall('POST', `/api/${name}/getUpdate`, { count, lastUpdated });
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

export const getSorterById = (id, getUserInfo = false, versionId = null, resultCount = null) => {
    return publicCall('POST', `/api/sorters/${id}`, { getUserInfo, versionId, resultCount });
};

export const getSorterVersionById = (id, versionId) => {
    return publicCall('POST', `/api/sorters/getVersion/${id}`, { versionId });
};

export const incrementSorterViews = (id) => {
    return publicCall('POST', '/api/sorters/viewCount', { id });
};

export const saveSorterResult = (result, accessToken = null) => {
    if (accessToken) return privateCall('POST', '/api/sorter_results/new', result, accessToken);
    else return publicCall('POST', '/api/sorter_results/new', result);
};

export const getSorterResultById = (id, accessToken = null) => {
    if (accessToken) return privateCall('GET', `/api/sorter_results/${id}`, null, accessToken);
    else return publicCall('GET', `/api/sorter_results/${id}`);
};

export const getSorterResultList = (ids) => {
    return publicCall('POST', `/api/sorter_results/idList`, { idList: ids });
};

export const getUserProfile = (id, accessToken) => {
    return privateCall('GET', `/api/users/${id}`, null, accessToken);
};

export const addFavoriteSorter = (sorter_id, accessToken) => {
    return privateCall('POST', `/api/users/addFavorite`, { sorter_id: sorter_id }, accessToken);
};

export const removeFavoriteSorter = (sorter_id, accessToken) => {
    return privateCall('POST', `/api/users/removeFavorite`, { sorter_id: sorter_id }, accessToken);
};

export const getLatestResultBySorterId = (sorter_id, accessToken) => {
    return privateCall('POST', `/api/sorter_results/getLatestResultBySorterId`, { sorter_id: sorter_id }, accessToken);
};

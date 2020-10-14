import axios from 'axios';

const privateCall = (method, url, body, accessToken) => {
    return axios({
        method,
        url,
        data: body,
        headers: { Authorization: accessToken },
        responseType: 'json'
    });
};

export const requestList = (name, page) => {
    return privateCall('POST', `/api/${name}`, { page });
};

export const createSorter = (sorter, accessToken) => {
    return privateCall('POST', '/api/sorters/create', { sorter }, accessToken);
};

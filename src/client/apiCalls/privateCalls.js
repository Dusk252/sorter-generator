import axios from 'axios';
import jsonToFormData from 'json-form-data';

const privateCall = (method, url, body, accessToken, extraHeaders = {}) => {
    return axios({
        method,
        url,
        data: body,
        headers: { Authorization: accessToken, ...extraHeaders },
        responseType: 'json'
    });
};

export const requestList = (name, page) => {
    return privateCall('POST', `/api/${name}`, { page });
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

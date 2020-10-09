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
    return publicCall('POST', `/api/${name}`, { page });
};

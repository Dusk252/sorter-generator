import axios from 'axios';

const publicCall = (method, url, body) => {
    return axios({
        method,
        url,
        data: body,
        responseType: 'json'
    });
};

export const refreshToken = () => {
    return publicCall('POST', '/api/auth/refresh-token', '');
};

export const localLogin = (email, password) => {
    return publicCall('POST', '/api/auth/login', { email, password });
};

export const requestList = (name, page) => {
    return publicCall('POST', `/api/${name}`, { page });
};

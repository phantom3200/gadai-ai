import axios from 'axios';

export const $api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 90000,
});

let authToken: string | null = null;

export const saveToken = (token: string | null) => {
    authToken = token;
};
const getToken = () => authToken;

$api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

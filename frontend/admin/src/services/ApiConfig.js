import axios from 'axios'
import config from './config.json'
import store from '../store/index'
import qs from 'qs'

const ax = axios.create({
    baseURL: config.api_url,
    paramsSerializer: function (params) {
        return qs.stringify(params);
    }
});

ax.interceptors.request.use(request => {
    store.commit('loadTrue');
    return request;
})

ax.interceptors.response.use(response => {
        store.commit('loadFalse');
        return response;
    },
    error => {
        store.commit('loadFalse');
        return Promise.reject(error);
    })

export default ax;

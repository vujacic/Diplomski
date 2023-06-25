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
    const token = sessionStorage.getItem('token');
    if(token)
        request.headers['Authorization'] = `Bearer ${token}`;
    store.commit('loadTrue');
    return request;
})

ax.interceptors.response.use(response => {
        store.commit('loadFalse');
        return response;
    },
    error => {
        store.commit('loadFalse');
        if(error.response.status == 401){
            let pathname='';
            sessionStorage.setItem('token', '');
            if(window.location.pathname){
                let list = window.location.pathname.split('/');
                if(list.length == 2 && list[1] == 'admin')
                    pathname = '/admin';
            }
            window.location.href = `${pathname}/login`;
        }
        return Promise.reject(error);
    })

export default ax;

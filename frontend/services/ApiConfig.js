let axios = require('axios')
let config = require('./config.json')
let qs = require('qs')

const ax = axios.create({
    baseURL: config.api_url,
    paramsSerializer: function (params) {
        return qs.stringify(params);
    }
});

module.exports = ax

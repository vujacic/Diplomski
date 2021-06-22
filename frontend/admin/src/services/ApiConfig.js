import axios from 'axios'
import config from './config.json'

const ax = axios.create({
    baseURL: config.api_url
});

export default ax;

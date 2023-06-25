import ax from './ApiConfig';
import {UserService, ContentService, AuthService} from 'apicomm'

let userService = UserService(ax);
let contentService = ContentService(ax);
let authService = AuthService(ax);

export {
    userService,
    contentService,
    authService
};

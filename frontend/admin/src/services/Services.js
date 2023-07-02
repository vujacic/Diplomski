import ax from './ApiConfig';
import {UserService, ContentService, AuthService, TermService, OptionService} from 'apicomm'

let userService = UserService(ax);
let contentService = ContentService(ax);
let authService = AuthService(ax);
let termService = TermService(ax);
let optionService = OptionService(ax);

export {
    userService,
    contentService,
    authService,
    termService,
    optionService
};

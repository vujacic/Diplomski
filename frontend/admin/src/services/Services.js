import ax from './ApiConfig';
import {UserService, ContentService} from 'apicomm'

let userService = UserService(ax);
let contentService = ContentService(ax);

export {
   userService,
    contentService
};

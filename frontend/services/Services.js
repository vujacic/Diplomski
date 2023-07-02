let ax = require('./ApiConfig')
let serv = require('apicomm')

let userService = serv.UserService(ax);
let contentService = serv.ContentService(ax);
let authService = serv.AuthService(ax);
let termService = serv.TermService(ax);
let optionService = serv.OptionService(ax);

module.exports = {
    userService,
    contentService,
    authService,
    termService,
    optionService
}

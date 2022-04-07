let ax = require('./ApiConfig')
let serv = require('apicomm')

let userService = serv.UserService(ax);
let contentService = serv.ContentService(ax);

module.exports = {
    userService,
    contentService
}

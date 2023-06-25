import {UserService} from "./UserService";
import jwt from "jsonwebtoken";

export class AuthService{
    userService;
    secret = "tajna"

    constructor(userService?: UserService) {
        if(userService)
            this.userService = userService;
        else
            this.userService = new UserService();
    }

    async logIn(email: string, password: string)  {
        let user = await this.userService.getByEmail(email);
        if(user && user.pass == password) {
            let role = await this.userService.getRoleByUserId(user._id);
            let token = jwt.sign({user: user, role: role}, this.secret, {expiresIn: "2h"})
            return {status: true, token: token};
        }
        return {status: false};
    }

    authorize = (roles?: string[], method?: string[]) => {
        return (req, res, next) => {
            let shouldAuthorize = this.shouldAuthorizeMethod(req, method);
            let status = 403;
            if(shouldAuthorize) {
                let decoded = this.decodeToken(req.headers['authorization']);
                let currDate = new Date().getTime();
                if(decoded.user && decoded.exp && decoded.exp * 1000 > currDate){
                    if(this.authorizeRole(roles, decoded.role)){
                        return next();
                    }
                } else {
                    status = 401;
                }
                res.status(status);
                return res.send({message: "No authorization or privileges"});
            }
            next();
        }
    }

    decodeToken(authHeader: string){
        if(authHeader){
            let token = authHeader.split(' ')[1];
            if(token){
                const decoded = jwt.verify(token, this.secret);
                return decoded;
            }
        }
        return null;
    }


     authorizeRole(allowedRole?: string[], role?: string[]){
        if (role && role.length > 0){
            return allowedRole?.some(x => role?.includes(x));
        }
        return true;
    }

    shouldAuthorizeMethod(req: any, method?: string[]){
        if(method && method.length > 0){
            return method.includes(req.method)
        }
        return false;
    }
}
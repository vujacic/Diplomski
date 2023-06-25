import express from "express";
import {UserService} from "../data/UserService";
import {AuthService} from "../data/AuthService";
import {UserDto} from "../data/Dto/UserDto";


const router = express.Router();
const userService = new UserService();
const authService = new AuthService(userService);

router.post('/', function(req, res, next) {
    const email = req.body.email;
    const pass = req.body.password;
    authService.logIn(email, pass)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});

export default router;
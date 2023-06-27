import express from 'express';
import {UserService} from "../data/UserService";
import {UserDto, UserFilter} from "../data/Dto/UserDto";
import {AuthService} from "../data/AuthService";

const router = express.Router();
const userService = new UserService();
const authService = new AuthService();

router.use('/', authService.authorize(["admin"], ["POST", "PUT", "DELETE", "GET"]));


router.get('/', function(req, res, next) {
    const filter = req.query as any;
    userService.getList(filter)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});


router.get('/:id', function(req, res, next) {
  //res.send('respond with a resource');
    userService.get(req.params['id'])
      .then((res1) =>
        res.send(res1))
      .catch((error)=> {
        next(error);
      });
});

router.post('/', function(req, res, next) {
    const newUser: UserDto = req.body;
    userService.create(newUser)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});

router.put('/:id', function(req, res, next) {
    const newUser = req.body;
    const id = req.params['id'];
    userService.update(id, newUser)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});

router.post('/optons', function(req, res, next) {
    const newUser = req.body;
    const id = req.params['id'];
    userService.update(id, newUser)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});


//module.exports = router;
export default router;

import express from 'express';
import {ContentService} from "../data/ContentService";
import {UserDto} from "../data/Dto/UserDto";
import {ContentDto} from "../data/Dto/ContentDto";
import {AuthService} from "../data/AuthService";

const authService = new AuthService();
const router = express.Router();
const contentService = new ContentService();

router.use('/', authService.authorize(["admin", "editor"], ["POST", "PUT", "DELETE"]));

router.get('/', function(req, res, next) {
    const filter = req.query as any;
    contentService.getList(filter)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});

router.get('/:id', function(req, res, next) {
    //res.send('respond with a resource');
    contentService.get(req.params['id'])
        .then((res1) =>{
           return res.send(res1);
        })
        .catch((error)=> {
            next(error);
        });
});

router.post('/', function(req, res, next) {
    const newContent: ContentDto = req.body;
    contentService.create(newContent)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});

router.put('/:id', function(req, res, next) {
    const newContent = req.body;
    const id = req.params['id'];
    contentService.update(id, newContent)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});

router.delete('/:id', function(req, res, next) {
    const id = req.params['id'];
    contentService.delete(id)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});

export default router;

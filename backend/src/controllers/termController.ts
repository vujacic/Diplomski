import {AuthService} from "../data/AuthService";
import {TermService} from "../data/TermService";
import {TermDto} from "../data/Dto/TermDto";
import express from "express";

const authService = new AuthService();
const termService = new TermService();
const router = express.Router();
router.use('/', authService.authorize(["admin"], ["POST", "PUT", "DELETE"]));

router.get('/', function(req, res, next) {
    const filter = req.query as any;
    termService.getAllByType(filter)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});

router.get('/:id', function(req, res, next) {
    //res.send('respond with a resource');
    termService.get(req.params['id'])
        .then((res1) =>{
            return res.send(res1);
        })
        .catch((error)=> {
            next(error);
        });
});

router.post('/', function(req, res, next) {
    const newTerm: TermDto = req.body;
    termService.create(newTerm)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});

router.put('/:id', function(req, res, next) {
    const newTerm = req.body;
    const id = req.params['id'];
    termService.update(id, newTerm)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});

router.delete('/:id', function(req, res, next) {
    const id = req.params['id'];
    termService.delete(id)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});

export default router;
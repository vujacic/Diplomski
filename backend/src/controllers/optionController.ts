import {AuthService} from "../data/AuthService";
import express from "express";
import {OptionsService} from "../data/OptionsService";
import {OptionDto} from "../data/Dto/OptionDto";

const authService = new AuthService();
const router = express.Router();
const optionService = new OptionsService();

router.use('/', authService.authorize(["admin"], ["POST", "PUT", "DELETE"]));

router.get('/', function(req, res, next) {
    const filter = req.query as any;
    optionService.getAll(/*filter*/)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});

router.get('/:id', function(req, res, next) {
    //res.send('respond with a resource');
    optionService.get(req.params['id'])
        .then((res1) =>{
            return res.send(res1);
        })
        .catch((error)=> {
            next(error);
        });
});

router.put('/', function(req, res, next) {
    const option: OptionDto[] = req.body;
    optionService.updateAll(option)
        .then((res1) =>
            res.send(res1))
        .catch((error)=> {
            next(error);
        });
});

export default router;
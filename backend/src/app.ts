// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var sassMiddleware = require('node-sass-middleware');
import express from 'express';
import path from 'path';
// import cookieParser from "cookie-parser";
import logger from 'morgan';

// var indexRouter = require('./controllers/index');
//var usersRouter = require('./controllers/users');
import usersController from './controllers/usersController';
import contentController from "./controllers/contentController";
import authController from "./controllers/authController";
import termController from "./controllers/termController";
import cors from 'cors';
import optionController from "./controllers/optionController";

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin: ['http://localhost:8080', 'http://localhost:3002', 'https://diplomskicms.duckdns.org','http://diplomskicms.duckdns.org']}));

// app.use(function(req,res,next){setTimeout(next,3000)});
// app.use(cookieParser());
// app.use(sassMiddleware({
//   src: path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   indentedSyntax: true, // true = .sass and false = .scss
//   sourceMap: true
// }));
//app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/api/term', termController);
app.use('/api/auth', authController)
app.use('/api/users', usersController);
app.use('/api/content', contentController);
app.use('/api/option', optionController);



app.use(function(err, req, res, next){
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.status(err.status || 500);
    res.send({ error: err.message });
});

app.use(function(req, res){
    res.status(404);
    res.send({ error: "Lame, can't find that" });
});

//module.exports = app;
export default app;

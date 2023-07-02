var express = require('express');
var router = express.Router();
var contentService = require('../services/Services').contentService;
var termService = require('../services/Services').termService;
var optionService = require('../services/Services').optionService;
const path = require('path');
const { stripHtml, defaults, version, Attribute, CbObj, Opts, Res, Tag } = require("string-strip-html");
var sortSet = require('../helpers/sortSetIndentation');

/* GET OPTIONS */
router.get('/*', function(req, res, next) {
    optionService.getOptions()
        .then((res1) =>{
            res.locals.options = res1.data;
            // console.log(res.locals.options);
            next();
        })
        .catch(e => {
            next(e);
        })
});
/* GET THEME */
router.get('/*', function(req, res, next) {
    optionService.getOption('theme_mods_francesca')
        .then((res1) =>{
            res.locals.theme = res1.data.value;
            next();
        })
        .catch(e => {
            next(e);
        })
});
/* GET MENU */
router.get('/*', function(req, res, next) {
    contentService.getContent(180950)
        .then((res1) =>{
            res.locals.menu = res1.data.body;
            next();
        })
        .catch(e => {
            next(e);
        })
});

router.get('/', function(req, res, next) {
    console.log(res.locals.theme);
    res.render('../templates/francesca/index', { menu: res.locals.menu, options: res.locals.options, theme: res.locals.theme });
});


router.get(['/admin', '/admin/*'], function (req, res, next) {
    res.sendFile(path.join(__dirname, '../admin/dist', 'app.html'))
})

router.get('/categories', async function (req, res, next) {
    const catParam = req.query.catId;

    let page = req.query.page;
    if (!page)
        page = 1;
    else
        page = parseInt(page);

    let limit = res.locals.options.find(x => x._key == 'posts_per_page').value;
    let res1 = catParam ? await contentService.getByCategory({page: page-1, limit: limit, sort: 'date', order: 'desc', key: catParam})
        : await contentService.getPagedContent({page: (page-1)*limit, limit: limit, sort: 'date', order: 'desc', type: 'post'});
    let r = res1.data.list;
    r.forEach((x)=>{
        x.body = stripHtml(x.body).result.split(/\s+/).slice(0, 10).join(" ");
    });
    let pageNo = Math.ceil(res1.data.count/ limit);

    let cats = (await termService.getTermByType({type: "category"})).data;
    cats = sortSet.sortSetIndentation(cats);
    sortSet.setIndent(cats, "  ")

    console.log(cats);

    return res.render('../templates/francesca/blog', {menu: res.locals.menu, options: res.locals.options, theme: res.locals.theme,
        blog: r, page: page, count: pageNo,
        cats: cats, url: catParam ? `/categories?catId=${catParam}&` : '/categories?' });
})

router.get('/*', async function(req, res, next) {
    try{
        let res1 = await contentService.getPagedContent({page: 0,limit: 1,sort: '_key',order: 'asc',name: req.params[0]});
        let r = res1.data.list[0];
        // console.log(res1.data);
        // console.log(menu.data.body);
        // console.log(req);
        if(res1.data.list.length == 0){
            return next();
        }

        res.render('../templates/francesca/page', { menu: res.locals.menu, options: res.locals.options,
            theme: res.locals.theme, post: r });

    }catch(e){
        next(e);
    }
});


module.exports = router;

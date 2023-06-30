var express = require('express');
var router = express.Router();
var service = require('../services/Services').contentService;
var termService = require('../services/Services').termService;
const path = require('path');
const { stripHtml, defaults, version, Attribute, CbObj, Opts, Res, Tag } = require("string-strip-html");
var sortSet = require('../helpers/sortSetIndentation');

/* GET home page. */
router.get('/', function(req, res, next) {
  service.getContent(180950)
      .then((res1) =>{
          // console.log(res1.data.body)
          res.render('../templates/francesca/index', { menu: res1.data.body });
        //res.send(res1.data);
      })
      .catch(e => {
          next(e);
      })
  // res.render('../templates/francesca/index', { title: 'Express' });
});


router.get(['/admin', '/admin/*'], function (req, res, next) {
    res.sendFile(path.join(__dirname, '../admin/dist', 'app.html'))
})

router.get('/categories', async function (req, res, net) {
    const catParam = req.query.catId;

    let page = req.query.page;
    if (!page)
        page = 1;
    else
        page = parseInt(page);

    let limit = 3;
    let res1 = catParam ? await service.getByCategory({page: page-1, limit: limit, sort: 'date', order: 'desc', key: catParam})
        : await service.getPagedContent({page: (page-1)*limit, limit: limit, sort: 'date', order: 'desc', type: 'post'});
    let r = res1.data.list;
    r.forEach((x)=>{
        x.body = stripHtml(x.body).result.split(/\s+/).slice(0, 10).join(" ");
    });
    let pageNo = Math.ceil(res1.data.count/ limit);

    let menu = await service.getContent(180950);

    let cats = (await termService.getTermByType({type: "category"})).data;
    cats = sortSet.sortSetIndentation(cats);
    sortSet.setIndent(cats, "  ")

    console.log(cats);

    return res.render('../templates/francesca/blog', {menu: menu.data.body, blog: r, page: page, count: pageNo,
        cats: cats, url: catParam ? `/categories?catId=${catParam}&` : '/categories?' });
})

router.get('/*', async function(req, res, next) {
    try{
        let res1 = await service.getPagedContent({page: 0,limit: 1,sort: '_key',order: 'asc',name: req.params[0]});
        let r = res1.data.list[0];
        let menu = await service.getContent(180950);
        console.log(res1.data);
        // console.log(menu.data.body);
        // console.log(req);
        if(res1.data.list.length == 0){
            return next();
        }

        res.render('../templates/francesca/page', { menu: menu.data.body, post: r });

    }catch(e){
        next(e);
    }
});


module.exports = router;

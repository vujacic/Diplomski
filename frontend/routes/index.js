var express = require('express');
var router = express.Router();
var service = require('../services/Services').contentService;
const path = require('path')

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

router.get('/*', async function(req, res, next) {
    try{
        let res1 = await service.getPagedContent({page: 0,limit: 1,sort: '_key',order: 'asc',name: req.params[0]});
        let r = res1.data.list[0];
        let menu = await service.getContent(180950);
        console.log(res1.data);
        // console.log(menu.data.body);
        // console.log(req);


        res.render('../templates/francesca/page', { menu: menu.data.body, post: r });

    }catch(e){
        next(e);
    }
});


module.exports = router;

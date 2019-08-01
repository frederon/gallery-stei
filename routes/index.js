var express = require('express');
var router = express.Router();
var fs = require('fs');


/* GET home page. */
router.get('/', function (req, res, next) {
  fs.readdir('./public/images/', (err, images) => {
    res.render("index", { title: "STEI 2019 - Regis Studio" , images});
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var fs = require('fs');
var c = require("../config");


/* GET home page. */
router.get('/', function (req, res, next) {
  fs.readdir(c.photoDir, (err, images) => {
    res.render("index", { title: "STEI 2019 - Regis Studio" , images});
  });
});

module.exports = router;

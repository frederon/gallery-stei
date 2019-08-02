var express = require("express");
var createError = require("http-errors");
var router = express.Router();
var jimp = require('jimp');
var c = require('../config');

/* GET home page. */
router.get("/", function(req, res, next) {
    if (!req.query.image) {
        next(createError(400));
    }
    jimp.read(c.imgDir + "/frame.jpg").then(frame => {
      jimp.read(c.imgDir + "/cheat.png").then(cheat => {
        jimp.read(c.domain + req.query.image).then(async function(foto) {
          foto.scaleToFit(1795, 1205);
          frame.composite(foto, 119, 123);
          frame.composite(cheat, 653, 123);
          let photo = await frame.getBufferAsync(jimp.MIME_PNG);
          res.writeHead(200, {
            "Content-Type": jimp.MIME_PNG,
            "Content-Length": photo.length
          });
          res.end(photo);
        });
      });
    });
});



module.exports = router;

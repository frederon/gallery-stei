var express = require("express");
var router = express.Router();
const imageThumbnail = require("image-thumbnail");
const fs = require("fs");
const c = require("../config");

async function getImage(options, req, res, next) {
  try {
    const stream = fs.createReadStream(c.photoDir + "/" + req.params.image);
    var thumbnail = await imageThumbnail(stream, options);

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": thumbnail.length
    });
    res.end(thumbnail);
  } catch (err) {
    next(err);
  }
}

router.get("/:image", function (req, res, next) {
  let options = {
    width: 300,
    responseType: "buffer"
  };
  getImage(options, req, res, next);
});

/* GET percentage. */
router.get("/:image/:percentage", function (req, res, next) {
  let options = {
    percentage: req.query.full ? 100 : req.params.percentage,
    responseType: "buffer"
  };
  getImage(options, req, res, next);
});

module.exports = router;

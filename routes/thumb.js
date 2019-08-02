var express = require("express");
var router = express.Router();
const imageThumbnail = require("image-thumbnail");
const fs = require("fs");
const c = require("../config");

/* GET percentage. */
router.get("/:image/:percentage", function (req, res, next) {
    async function getImage() {
        try {
          const stream = fs.createReadStream(
            c.photoDir + "/" + req.params.image
          );
          var thumbnail =
            await imageThumbnail(stream, {
              percentage: req.query.full ? 100 : req.params.percentage,
              responseType: 'buffer'
            });

            res.writeHead(200, {
              "Content-Type": "image/png",
              "Content-Length": thumbnail.length
            });
            res.end(thumbnail); 
        } catch (err) {
          next(err);
        }
    }
    getImage();
});

module.exports = router;

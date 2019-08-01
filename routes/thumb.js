var express = require("express");
var router = express.Router();
const imageThumbnail = require("image-thumbnail");
const fs = require("fs");

/* GET percentage. */
router.get("/:image/:percentage", function (req, res, next) {
    console.log(req.params)
    async function getImage() {
        try {
          const stream = fs.createReadStream(
            "./public/images/" + req.params.image
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

// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = router;

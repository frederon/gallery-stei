var express = require("express");
var createError = require("http-errors");
var router = express.Router();
var fs = require("fs");
var upload = require("multer")({ dest: "./public/refImages" });
var c = require("../config");

/* GET Reference Image. */
router.post("/", upload.single("ref"), function (req, res, next) {
  if (!req.file) {
    return next(createError(400, 'Please upload your selfie to search'));
  }
  fs.readdir(c.photoDir, (err, images) => {
    res.render("search", {
      title: "STEI 2019 - Regis Studio",
      reference:
        "data:image/png;base64, " +
        fs.readFileSync(req.file.path, { encoding: "base64" }),
      refData: req.file.filename,
      results: images
    });
  });
});

router.post("/:id", function (req, res, next) {
  let path = `./public/refImages/${req.params.id}.json`;
  fs.writeFile(path, JSON.stringify(req.body), function(err) {
    if (err) {
      return console.log(err);
    }
    res.send("saved.")
  }); 
});

router.get("/:id", function(req, res, next) {
  res.render("search-id", {
    title: "STEI 2019 - Regis Studio",
    images: JSON.parse(fs.readFileSync(`./public/refImages/${req.params.id}.json`))
  });
});

module.exports = router;

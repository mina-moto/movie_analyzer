var express = require('express');
var router = express.Router();
const path = require("path")

/* GET home page. */
router.get('/*', function(req, res, next) {
  res.sendFile(path.resolve("./public/index.html"))
});

module.exports = router;

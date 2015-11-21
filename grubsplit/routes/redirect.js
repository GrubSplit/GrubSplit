var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/auth', function(req, res) {
  console.log(res);
  res.render('redirect', {
    'res': res
  });
});

module.exports = router;
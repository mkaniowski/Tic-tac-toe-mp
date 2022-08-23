var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req: Express.Request, res: Express.Response, next: any) {
  res.render('index', { title: 'Expresss' });
});

module.exports = router;

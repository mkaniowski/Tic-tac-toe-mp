var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req: Express.Request, res: Express.Response, next: any) {
  res.send('respond with a resourcee');
});

module.exports = router;

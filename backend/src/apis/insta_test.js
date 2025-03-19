let bodyParser = require('body-parser');
let express = require('express');
let xhub = require('express-x-hub');
let router = express.Router();

router.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
router.use(bodyParser.json());

let token = process.env.TOKEN || 'token';
let received_updates = [];

router.use(function(req, res, next) {
  console.log('Received request:', req.method, req.url);
  next();
});

router.get('/instagram', function(req, res) {
  if (
  req.query['hub.mode'] == 'subscribe' &&
  req.query['hub.verify_token'] == token
  ) {
  res.send(req.query['hub.challenge']);
  } else {
  res.sendStatus(400);
  }
});

router.post('/instagram', function(req, res) {
  console.log('Instagram request body:');
  console.log(req.body);
  received_updates.unshift(req.body);
  res.sendStatus(200);
});

module.exports = router;

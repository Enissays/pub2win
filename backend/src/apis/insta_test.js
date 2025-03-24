let bodyParser = require('body-parser');
let express = require('express');
let xhub = require('express-x-hub');
let router = express.Router();

const { getClientByInstagramUsername } = require('../repository/client.dao');

router.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
router.use(bodyParser.json());

let token = process.env.TOKEN || 'token';
let received_updates = [];

router.use(function(req, res, next) {
  console.log('Received request:', req.method, req.url);
  next();
});

function getWebhook(req, res) {
  if (
  req.query['hub.mode'] == 'subscribe' &&
  req.query['hub.verify_token'] == token
  ) {
  res.send(req.query['hub.challenge']);
  } else {
  res.sendStatus(400);
  }
}

function postWebhook(req, res) {
  console.log('Instagram request body:');
  console.log(req.body);
  received_updates.unshift(req.body);
  
  res.sendStatus(200);
}

function testGetAllReceivedUpdates(req, res) {
  res.send(received_updates);
}

module.exports = {
  getWebhook,
  postWebhook,
  testGetAllReceivedUpdates
}
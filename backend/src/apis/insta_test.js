let bodyParser = require('body-parser');
let express = require('express');
let xhub = require('express-x-hub');
let router = express.Router();
const axios = require('axios');

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

async function callBackInstagram(req, res) {
  const { code, state: userId } = req.query; // Récupère `code` et `state`

  if (!code || !userId) {
      return res.status(400).send("Code d'autorisation ou ID utilisateur manquant");
  }

  try {
      // Échanger le code contre un access_token
      const response = await axios.post('https://api.instagram.com/oauth/access_token', {
          client_id: process.env.INSTAGRAM_APP_ID,
          client_secret: process.env.INSTAGRAM_APP_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
          code
      });
      const { access_token, user_id: instagramId } = response.data;

        // Associer l'ID Instagram à ton utilisateur dans la base de données
        console.log(`Utilisateur App ID: ${userId}, Instagram ID: ${instagramId}`);

        // Stocker dans la base de données (exemple)
        // await db.query("UPDATE users SET instagram_id = ? WHERE id = ?", [instagramId, userId]);

        // Rediriger l'utilisateur vers son profil

    } catch (error) {
        console.error("Erreur lors de l'échange du code :", error);
        res.status(500).send("Erreur lors de l'authentification Instagram");
    }
}


module.exports = {
  getWebhook,
  postWebhook,
  testGetAllReceivedUpdates,
  callBackInstagram
}
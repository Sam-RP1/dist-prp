const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('../../config.js');
const mw = require('../../middleware.js');

const logout = express.Router();

module.exports = logout;

logout.use(bodyParser.json());
logout.use(bodyParser.urlencoded({ extended: true }));
logout.use(session(config.cookie));
logout.use(mw.checkUserAuth);

logout.post('/logout', async function(req, res) {
  try {
    if (req.session) {
      req.session.destroy(function(err) {
        if (err) {
          console.log(err)
        }
      })
    }
    res.clearCookie('prpUILayout').clearCookie('prpUserCookie').redirect('/');
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});

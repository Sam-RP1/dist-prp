const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');
const dbAuth = require('../../db/db-auth.js');
const dbUser = require('../../db/db-user.js');

const login = express.Router();

module.exports = login;

login.use(bodyParser.json());
login.use(bodyParser.urlencoded({ extended: true }));
login.use(session(config.cookie));

login.post('/login', async function(req, res) {
  try {
    const token = req.body.idtoken; // Verify the token recieved
    const ticket = await config.gClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const checkUserId = await dbUser.checkUserId(payload['sub']); // Check DB for user

    if (checkUserId.status === 'exists') { // 1. User account exists
      const userRecord = await dbUser.getUserRecord(payload['sub']);
      if (userRecord.email !== payload['email'] || userRecord.name !== payload['name'] || userRecord.picture !== payload['picture']) {
        updateUserDetails(userRecord, payload);
      }
      const userCookie = await dbUser.getUserCookie(payload['sub']);
      req.session.userId = payload['sub']; // Set the users ID to their session
      req.session.userTier = userRecord.tier
      console.log(userCookie.data)
      return res.status(200).cookie('prpUILayout', 0).cookie('prpUserCookie', userCookie.data).send("/main/dashboard");
    } else if (checkUserId.status === 'empty') { // 1. User account does not exist
      const postfix = payload['email'].split('@');
      const emailCheck = await dbAuth.checkPostFix(postfix[1]);

      if (emailCheck.approved = 1) {
        const tier = emailCheck.tier;
        const userDetails = { id: payload['sub'], email: payload['email'], name: payload['name'], picture: payload['picture'], tier: tier };
        const result = await dbUser.createUser(userDetails);

        if (result.status === 'success') {
          // could seperate into its own function for creating the users folder
          const dirpath = './appdata/users/';
          const newFolder = payload['sub'];
          fs.mkdir(path.join(dirpath, newFolder), { recursive: true }, (err) => {
            if (err) {
              console.log(err)
            }
          })
          const userCookie = await dbUser.getUserCookie(payload['sub']);
          req.session.userId = payload['sub'];
          req.session.userTier = 0;
          console.log("NEW USER")
          console.log(userCookie.data)
          return res.status(201).cookie('prpUILayout', 0).cookie('prpUserCookie', userCookie.data).send("/main/dashboard");
        } else {
          res.redirect(400, '/');
        }
      } else {
        res.redirect(404, '/');
      }
    } else {
      res.redirect(403, '/');
    }
  } catch(e) {
    console.log(e);
    res.redirect(400, '/');
  }
});

async function updateUserDetails(userRecord, payload) {
  let updateDetails = { id: userRecord.id, email: userRecord.email, name: userRecord.name, picture: userRecord.picture }
  if (userRecord.email !== payload['email']) {
    updateDetails.email = payload['email'];
  }
  if (userRecord.name !== payload['name']) {
    updateDetails.name = payload['name'];
  }
  if (userRecord.picture !== payload['picture']) {
    updateDetails.picture = payload['picture'];
  }
  await dbUser.updateUserRecord(updateDetails);
};

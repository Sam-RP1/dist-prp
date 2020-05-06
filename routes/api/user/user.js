const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const _ = require('underscore');
const config = require('../../../config.js');
const mw = require('../../../middleware.js');
const dbClass = require('../../../db/db-class.js');
const dbUser = require('../../../db/db-user.js');

const user = express.Router();

module.exports = user;

user.use(bodyParser.json());
user.use(bodyParser.urlencoded({ extended: true }));
user.use(session(config.cookie));
user.use(mw.checkUserAuth)

user.get('/profile', async function(req, res) {
  try {
    const userId = req.session.userId;
    const userProfile = await dbUser.getUserProfile(userId);
    res.send(userProfile);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
});

user.get('/email', async function(req, res) {
  try {
    const userId = req.session.userId;
    const userEmail = await dbUser.getUserEmail(userId);
    res.send(userEmail.email);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
});

user.get('/name', async function(req, res) {
  try {
    const userId = req.session.userId;
    const userName = await dbUser.getUserName(userId);
    res.send(userName.name);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
});

user.get('/avatar', async function(req, res) {
  try {
    const userId = req.session.userId;
    const userAvatar = await dbUser.getUserAvatar(userId);
    res.send(userAvatar.picture);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
});

user.get('/tier', async function(req, res) {
  try {
    const userId = req.session.userId;
    const userTier = await dbUser.getUserTier(userId);
    res.status(200).json(userTier.tier);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
});

user.get('/classes', async function(req, res) {
  try {
    const userId = req.session.userId;
    const userTier = req.session.userTier;
    const userClasses = await dbUser.getUserClasses(userId, userTier);
    let data = [];
    const classesOrdered = _.sortBy(userClasses, 'dateCreated');
    const classesSorted = classesOrdered.reverse();
    if (userTier === 1) {
      // classes name, unit code, class code, num students
      for (let i = 0; i < classesSorted.length; i++) {
        const classSize = await dbClass.getClassSize(classesSorted[i].id);
        const row = {
          name: classesSorted[i].name,
          unitCode: classesSorted[i].unitCode,
          value1: classSize,
          value2: classesSorted[i].id,
          ref: classesSorted[i].id
        };
        data.push(row);
      }
    } else { // classes name, unit code, num assignments, num reviews
      for (let i = 0; i < classesSorted.length; i++) {
        const numAssignments = await dbClass.getNumActiveAsgmt(classesSorted[i].id);
        const numReviews = await dbClass.getNumActiveRev(classesSorted[i].id, userId);
        const row = {
          name: classesSorted[i].name,
          unitCode: classesSorted[i].unitCode,
          value1: numAssignments,
          value2: numReviews,
          ref: classesSorted[i].id
        };
        data.push(row);
      }
    }
    res.send(data);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
});

user.get('/manual/view', async function(req, res) {
  try {
    res.sendFile("User-Manual-PRP.pdf", { root: './appdata/' })
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble getting this file at the moment. Please try again later.' });
  }
});

user.put('/cookie/data', async function(req, res) {
  try {
    const userId = req.session.userId;
    let data = req.body.data;
    console.log(data)
    const result = await dbUser.updateUserCookie(userId, data);
    if (result.status === 'empty') {
      return res.status(500).json({ status: 'fail', msg: 'Not able to update user cookie.' })
    }
    res.status(200).json({ status: 'success', msg: 'User cookie updated.' })
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'Server Error' });
  }
});

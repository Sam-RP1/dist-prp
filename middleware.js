'use strict';

//------------- GLOBAL VARIABLES -------------//
const session = require('express-session');
const dbUser = require('./db/db-user.js');
const dbClass = require('./db/db-class.js');
const dbAsgmt = require('./db/db-asgmt.js');
const dbFile = require('./db/db-file.js');

/**
* checkUserAuth -
* A middleware function used to check if a user is authorised
* Uses 'req.session' to access the userId and userTier stored in the session
* The userId is used to check if it exists in the DB and is a registered user
* The userTier is used to check against the users tier stored in the DB
* Responses:
* Redirect to '/' when 'req.session.userId' not found
* Redirect to '/' when 'req.session.userId' does not exist in the DB
* Redirect to '/' when 'req.session.userTier' does not match
* Session destroyed and redirected to '/' for a tampered cookie
*/
module.exports.checkUserAuth = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const userTier = req.session.userTier;
    if (!req.session.userId) { // If not authorised
      res.redirect('/');
    } else { // If authorised
      const checkId = await dbUser.checkUserId(userId); // Check if userId exists
      if (checkId.status === 'exists') { // If userId does exist
        const dbUserTier = await dbUser.getUserTier(userId, userTier); // Check if userTier exists for userId
        if (dbUserTier.status === 'success' && dbUserTier.tier === userTier) { // If userTier does exist and matches, next()
          console.log("User is authorised");
          next();
        } else { // If userTier is not correct, redirect
          req.session.destroy(function(err) { if (err) { console.log(err) } })
          res.redirect('/');
        }
      } else { // If userId does not exist, redirect
        req.session.destroy(function(err) { if (err) { console.log(err) } })
        res.redirect('/');
      }
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'Sorry! We are having trouble processing some requests right now. Please try again later.' });
  }
};

/**
* checkUserTierZero -
* A middleware function used to check if a user is a tier 0 user and can be allowed to continue
* Uses 'req.session' to access the userId and the userTier stored in the session
* The userId and userTier are then used to verify if the req can continue
* Responses:
* Session destroyed and redirected to '/' for a tampered cookie
* '403' for a user that is not tier 0
* '500' if an error is caught
*/
module.exports.checkUserTierZero = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const userTier = req.session.userTier;
    if (userTier === 0) {
      console.log("Checking User Tier in DB")
      const dbUserTier = await dbUser.getUserTier(userId);
      if (dbUserTier.tier === 0) {
        next();
      } else {
        console.log("User session is tier 0, but DB is tier 1, User has tampered with cookie")
        console.log("Logging user out of current session")
        req.session.destroy(function(err) { if (err) { console.log(err) } })
        res.redirect('/');
      }
    } else {
      res.status(403).json({ status: 'fail', msg: 'You must be a tier 0 user to make this request.'});
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'Sorry! We are having trouble processing some requests right now. Please try again later.' });
  }
};

/**
* checkUserTierOne -
* A middleware function used to check if a user is a tier 1 user and can be allowed to continue
* Uses 'req.session' to access the userId and the userTier stored in the session
* The userId and userTier are then used to verify if the req can continue
* Responses:
* Session destroyed and redirected to '/' for a tampered cookie
* '403' for a user that is not tier 1
* '500' if an error is caught
*/
module.exports.checkUserTierOne = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const userTier = req.session.userTier;
    if (userTier === 1) {
      console.log("Checking User Tier in DB")
      const dbUserTier = await dbUser.getUserTier(userId);
      if (dbUserTier.tier === 1) {
        next();
      } else {
        console.log("User session is tier 1, but DB is tier 0, User has tampered with cookie")
        console.log("Logging user out of current session")
        req.session.destroy(function(err) { if (err) { console.log(err) } })
        res.redirect('/');
      }
    } else {
      res.status(403).json({ status: 'fail', msg: 'You must be a tier 1 user to make this request.'});
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'Sorry! We are having trouble processing some requests right now. Please try again later.' });
  }
};

/**
* redirectDashboard -
* A middleware function used to redirect a user to the dashboard from the '/' route if they have a valid session
* Uses 'req.session' to access the userId and the userTier stored in the session
* The userId and userTier are then used to verify if the req can continue
* Responses:
* Redirect to '/main/dashboard' if 'req.session.userId' exists and is valid
*/
module.exports.redirectDashboard = async (req, res, next) => {
  if (req.session.userId) { // If authorised
    const check = await dbUser.checkUserId(req.session.userId); // Check if userId exists
    if (check.status === 'exists') { // If userId does exist, next()
      res.redirect('/main/dashboard')
    } else { // If userId does not exist, destroy cookie and next()
      req.session.destroy(function(err) { if (err) { console.log(err) } })
      next();
    }
  } else { // If not authorised
    next();
  }
};

module.exports.checkClassOwnership = async (req, res, next) => {
  const userId = req.session.userId;
  const userTier = req.session.userTier;
  let classId;
  if (req.params.classId) { classId = req.params.classId; };
  if (req.query.classId) { classId = req.query.classId; };
  const result = await dbClass.checkUserInClass(userId, userTier, classId);
  if (result.status === 'exists') { // If user making request is the owner of class, next()
    next();
  } else {
    res.status(403).json({ status: 'fail', msg: 'Sorry! You are not the owner of this class and cannot access any information related to it.' });
  }
};

module.exports.checkClassAsgmtUserIntegrity = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const userTier = req.session.userTier;
    let classId;
    let asgmtId;
    if (req.params.classId) {
      classId = req.params.classId;
      asgmtId = req.params.asgmtId;
    } else if (req.query.classId) {
      classId = req.query.classId;
      asgmtId = req.query.asgmtId;
    } else {
      res.status(400).json({ status: 'fail', msg: 'Sorry! The request syntax was incorrect. Please use either ONLY URL parameters or ONLY URL query variables.' });
    }
    const checkClassExists = await dbClass.checkClassId(classId);
    const checkAsgmtExists = await dbAsgmt.checkAsgmtId(asgmtId);
    if (checkClassExists.status === 'exists' && checkAsgmtExists.status === 'exists') {
      const checkAsgmtInClass = await dbClass.checkAsgmtInClass(classId, asgmtId);
      if (checkAsgmtInClass.status === 'exists') {
        const checkUserInClass = await dbClass.checkUserInClass(userId, userTier, classId);
        if (checkUserInClass.status === 'exists') {
          next();
        } else {
          res.status(401).json({ status: 'fail', msg: 'Sorry! You are not apart of this class and cannot access it.' });
        }
      } else {
        res.status(404).json({ status: 'fail', msg: 'Sorry! The assignment requested is not apart of the class requested.' });
      }
    } else {
      res.status(404).json({ status: 'fail', msg: 'Sorry! Either the requested class or assignment does not exist.' });
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'Sorry! We are having trouble getting this assignment at the moment. Please try again later.' });
  }
};

module.exports.checkFile = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const userTier = req.session.userTier;
    let classId;
    let asgmtId;
    let fileId;
    if (req.params.classId) {
      classId = req.params.classId;
      asgmtId = req.params.asgmtId;
      fileId = req.params.fileId;
    } else if (req.query.classId) {
      classId = req.query.classId;
      asgmtId = req.query.asgmtId;
      fileId = req.query.fileId;
    } else {
      res.status(400).json({ status: 'fail', msg: 'Sorry! The request syntax was incorrect. Please use either ONLY URL parameters or ONLY URL query variables.' });
    }
    const checkFileExists = await dbFile.checkFile(fileId, asgmtId);

  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'Sorry! We are having trouble getting this file at the moment. Please try again later.' });
  }
};

module.exports.acceptSubmission = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const classId = req.params.classId;
    const asgmtId = req.params.asgmtId;
    const today = Date.now();
    let asgmtSubmissionDue = await dbAsgmt.getAsgmtSubmissionDueTime(asgmtId);
    asgmtSubmissionDue = asgmtSubmissionDue.toString();
    const dueDeadline = Date.parse(asgmtSubmissionDue);

    if (today < dueDeadline) {
      next();
    } else {
      res.status(403).json({ status: 'fail', msg: 'The deadline for submission has passed.' });
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble submitting this file at the moment.' });
  }
};

module.exports.acceptReview = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const classId = req.params.classId;
    const asgmtId = req.params.asgmtId;
    const today = Date.now();
    console.log(asgmtId)
    let asgmtReviewDue = await dbAsgmt.getAsgmtReviewDueTime(asgmtId);
    asgmtReviewDue = asgmtReviewDue.toString();
    const dueDeadline = Date.parse(asgmtReviewDue);

    if (today < dueDeadline) {
      next();
    } else {
      console.log("Cannot submit review")
      res.status(403).json({ status: 'fail', msg: 'The deadline for reviews has passed.' });
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble submitting this review at the moment.' });
  }
};

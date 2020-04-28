'use strict';

//------------- GLOBAL VARIABLES -------------//
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const randomstring = require('randomstring');
const _ = require('underscore');
const config = require('../../../config.js');
const mw = require('../../../middleware.js');
const dbAsgmt = require('../../../db/db-asgmt.js');
const dbClass = require('../../../db/db-class.js');
const dbUser = require('../../../db/db-user.js');

const cls = express.Router();

module.exports = cls;

cls.use(bodyParser.json());
cls.use(bodyParser.urlencoded({ extended: true }));
cls.use(session(config.cookie));
cls.use(mw.checkUserAuth); // All requests must come from authorised users

//------------- FUNCTIONS -------------//
cls.get('/assignments', async function(req, res) {
  try {
    const userId = req.session.userId;
    const userTier = req.session.userTier;
    const classId = req.query.classId;
    const result = await dbClass.getClassAssignments(classId); // Get assignments for the class and all their details
    if (userTier === 1) { // If user tier 1 get the details about the students in the class
      const classSize = await dbClass.getClassSize(classId);// Get Num Students
      for (let i=0; i < result.length; i++) {
        const numAsgmtSubmitted = await dbAsgmt.getNumAsgmtSubmitted(result[i].id);
        const numReviewsDone = await dbAsgmt.getNumReviewsCompleted(result[i].id); // gets number of people who 100% their reviews
        result[i].workSubmitted = numAsgmtSubmitted;
        result[i].reviewsCompleted = numReviewsDone;
        result[i].classSize = classSize;
      }
    } else { // if user tier 0 see if submitted work and completed all reviews
      for (let i=0; i < result.length; i++) {
        const submittedCheck = await dbAsgmt.checkUserSubmittedWork(userId, result[i].id);
        const reviewsCheck = await dbAsgmt.checkUserCompletedReviews(userId, result[i].id); // Gets num revs done
        if (submittedCheck.status === 'exists') {
          result[i].workSubmitted = 1;
        } else {
          result[i].workSubmitted = 0;
        }
        if (reviewsCheck.status === 'exists') {
          result[i].reviewsCompleted = 1;
        } else {
          result[i].reviewsCompleted = 0;
        }
      }
    }
    res.status(200).send(result);
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble loading classes at the moment. Please try again later.' });
  }
});

cls.get('/details', mw.checkUserTierOne, mw.checkClassOwnership, async function(req, res) {
  try {
    const classId = req.query.classId;
    const classNameAndCode = await dbClass.getClassNameAndCode(classId);
    const numAsgmt = await dbClass.getNumAsgmt(classId);
    const numActiveAsgmt = await dbClass.getNumActiveAsgmt(classId);
    const numPastAsgmt = await dbClass.getNumPastAsgmt(classId);
    const classRegister = await dbClass.getClassRegister(classId);
    const classDetails = {
      className: classNameAndCode.name,
      classUnitCode: classNameAndCode.unitCode,
      numAssignments: numAsgmt,
      numActiveAssignments: numActiveAsgmt,
      numPastAssignments: numPastAsgmt,
      classSize: classRegister.length,
      classRegister: classRegister,
    };
    res.status(200).json({ status: 'success', classDetails })
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble loading details at the moment. Please try again later.' });
  }
});

cls.post('/create', mw.checkUserTierOne, async function(req, res) {
  try {
    const userId = req.session.userId;
    const className = req.body.class.name;
    const classUnitCode = req.body.class.unitCode;
    let classId;
    let check = false;

    while (check === false) {
      classId = randomstring.generate({length: 8,charset: 'alphanumeric'});
      const classIdSearch = await dbClass.checkClassId(classId);
      if (classIdSearch.status === 'empty') {
        check = true;
      }
    }

    const result = await dbClass.createClass(classId, className, classUnitCode, userId)
    if (result.status === 'success') {
      const dirpath = './appdata/classes/'
      const newFolder = classId;
      fs.mkdir(path.join(dirpath, newFolder), { recursive: true }, (err) => {
        if (err) {
          console.log(err)
        } else {
          return res.status(200).json({ status: 'success', msg: 'Class has been created.' });
        }
      })
    } else {
      return res.status(500).json({ status: 'fail', msg: 'We are having trouble creating classes at the moment. Please try again later.' });
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble creating classes at the moment. Please try again later.' });
  }
});

cls.post('/join', mw.checkUserTierZero, async function(req, res) {
  try {
    const userId = req.session.userId;
    const classId = req.body.id;
    const checkClassId = await dbClass.checkClassId(classId);
    if (checkClassId.status === 'exists') { // 1. Class does exist
      const checkUserInClass = await dbClass.checkUserInClass(userId, classId);
      if (checkUserInClass.status === 'empty') { // 2. User is not in class
        const result = await dbClass.addUserToClass(userId, classId);
        if (result.status === 'success') { // 3. User added to class
          return res.status(200).json({ status: 'success', msg: 'You have joined the class.' });
        } else { // 3. User not added to class
          return res.status(500).json({ status: 'fail', msg: 'We are having trouble adding you to that class at the moment. Please try again later.' });
        }
      } else { // 2. User is already in the class
        return res.status(409).json({ status: 'fail', msg: 'You are already in this class!' });
      }
    } else { // 1. Class does not exist
      return res.status(404).json({ status: 'fail', msg: 'Class ID entered does not exist. Please try again.' });
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble adding you to that class at the moment. Please try again later.' });
  }
});

cls.delete('/leave', mw.checkUserTierZero, async function(req, res) {
  try {
    const userId = req.session.userId;
    const classId = req.body.id;
    const checkClassId = await dbClass.checkClassId(classId);
    if (checkClassId.status === 'exists') { // 1. Class does exist
      const result = await dbClass.leaveClass(userId, classId); // Attempt to remove user
      if (result.status === 'success') { // 2. User has been removed from the class
        updateUserCookie(userId, classId);
        return res.status(200).json({ status: 'success', msg: 'You have left the class.' });
      } else { // 2. User has not been removed from the class
        return res.status(500).json({ status: 'fail', msg: 'We could not remove you from the class at this moment. Please try again later' });
      }
    } else { // 1. Class does not exist
      return res.status(404).json({ status: 'fail', msg: 'The class does not exist!? Please refresh and try again.' });
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble removing you from this class at the moment. Please try again later.' });
  }
});

cls.delete('/delete', mw.checkUserTierOne, async function(req, res) {
  try {
    const userId = req.session.userId;
    const classId = req.body.id;
    const checkClassId = await dbClass.checkClassId(classId);
    if (checkClassId.status === 'exists') { // 1. Class does exist
      // Need to delete all the students stuff here
      const register = await dbClass.getClassUserIds(classId);
      const classSubmissions = await dbClass.getClassSubmissions(classId); // Used to delete class files
      const result = await dbClass.deleteClass(userId, classId); // Attempt deletion
      if (result.status === 'success') { // 2. If successful deletion
        const checkClassGone = await dbClass.checkClassId(classId); // Confirm if the class has been deleted
        if (checkClassGone.status === 'empty') { // 3. Class has been deleted
          const dirpath = './appdata/classes/';
          const folder = classId;
          fs.rmdir(path.join(dirpath, folder), { recursive: true }, (err) => {
            if (err) {
              console.log(err)
              return res.status(200).json({ status: 'fail', msg: 'We are having trouble deleting this class at the moment. Please try again later.' });
            }
          });
          for (let i = 0; i < classSubmissions.length; i++) {
            let asgmtSubmissions = classSubmissions[i];
            for (let i = 0; i < asgmtSubmissions.length; i++) {
              const path = './' + asgmtSubmissions[i].uri;
              fs.unlink(path, (err) => {
                if (err) {
                  console.log(err)
                  return res.status(500).json({ status: 'fail', msg: 'We are having trouble deleting this class at the moment. Please try again later.' });
                }
              });
            }
          }
          updateUsersCookies(register, classId);
          return res.status(200).json({ status: 'success', msg: 'The class has been deleted.' });
        } else { // 3. Class has not been deleted
          return res.status(404).json({ status: 'fail', msg: 'The class was not deleted. Please ensure the class you are trying to delete is your own.' });
        }
      } else { // 2. If not successful deletion
        return res.status(500).json({ status: 'fail', msg: 'The class was not deleted. This is probably our fault. Please try again later.' });
      }
    } else { // 1. Class doesnt exist
      return res.status(404).json({ status: 'fail', msg: 'The class does not exist!? Please refresh and try again.' });
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble deleting this class at the moment. Please try again later.' });
  }
});

async function updateUserCookie(userId, classId) {
  try {
    const cookie = await dbUser.getUserCookie(userId)
    if (cookie.status === 'success') {
      const cookieData = cookie.data;
      const dataArr = cookieData.split(',');
      let dataString;

      for (let i = 0; i < dataArr.length; i++) {
        if (dataArr[i] === classId) { // If match is found remove it
          if (dataArr.length === 1) {
            dataString = "";
          }
        } else { // If no match found form the string of data
          if (dataString === undefined) {
            dataString = dataArr[i];
          } else {
            dataString = dataString + ',' + dataArr[i];
          }
        }
      }

      if (dataString !== cookieData) {
        const result = await dbUser.updateUserCookie(userId, dataString);
      }
    }
  } catch(e) {
    console.log(e);
  }
};

async function updateUsersCookies(register, classId) {
  try {
    for (let i = 0; i < register.length; i++) {
      const cookie = await dbUser.getUserCookie(register[i].usr_id);
      if (cookie.status === 'success') {
        const cookieData = cookie.data;
        const dataArr = cookieData.split(',');
        let dataString;

        for (let i = 0; i < dataArr.length; i++) {
          if (dataArr[i] === classId) { // If match is found remove it
            if (dataArr.length === 1) {
              dataString = "";
            }
          } else { // If no match found form the string of data
            if (dataString === undefined) {
              dataString = dataArr[i];
            } else {
              dataString = dataString + ',' + dataArr[i];
            }
          }
        }

        if (dataString !== cookieData) {
          const result = await dbUser.updateUserCookie(register[i].usr_id, dataString);
        }
      }
    }
  } catch(e) {
    console.log(e);
  }
};

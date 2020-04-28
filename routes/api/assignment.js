const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const randomstring = require('randomstring');
const multer = require('multer')
const config = require('../../config.js');
const mw = require('../../middleware.js');
const dbClass = require('../../db/db-class.js');
const dbAsgmt = require('../../db/db-asgmt.js');
const dbFile = require('../../db/db-file.js');

const asgmt = express.Router();

module.exports = asgmt;

asgmt.use(bodyParser.json());
asgmt.use(bodyParser.urlencoded({ extended: true }));
asgmt.use(session(config.cookie));
asgmt.use(mw.checkUserAuth);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tmp/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage });

asgmt.get('/assignment', mw.checkClassAsgmtUserIntegrity, async function(req, res) {
  try {
    const asgmtId = req.query.asgmtId;
    const asgmt = await dbAsgmt.getAssignment(asgmtId);
    const submissionDate = asgmt[0].dueDateSubmissions.toString();
    const reviewsDate = asgmt[0].dueDateReviews.toString();
    asgmt[0].dueDateSubmissions = submissionDate;
    asgmt[0].dueDateReviews = reviewsDate;
    if (asgmt[0].fileOne !== null) {
      const fileSplit = asgmt[0].fileOne.split('/');
      asgmt[0].fileOneName = fileSplit[4];
      asgmt[0].fileOne = asgmt[0].fileOne.toString().slice(16);
    }
    if (asgmt[0].fileTwo !== null) {
      const fileSplit = asgmt[0].fileTwo.split('/');
      asgmt[0].fileTwoName = fileSplit[4];
      asgmt[0].fileTwo = asgmt[0].fileTwo.toString().slice(16);
    }
    if (asgmt[0].fileThree !== null) {
      const fileSplit = asgmt[0].fileThree.split('/');
      asgmt[0].fileThreeName = fileSplit[4];
      asgmt[0].fileThree = asgmt[0].fileThree.toString().slice(16);
    }
    res.status(200).send(asgmt);
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble getting this assignment at the moment. Please try again later.' });
  }
});

asgmt.get('/assignment/details', mw.checkUserTierOne, mw.checkClassOwnership, async function(req, res) {
  try {
    const classId = req.query.classId;
    const asgmtId = req.query.asgmtId;
    const classSize = await dbClass.getClassSize(classId);
    const numSubmissions = await dbAsgmt.getNumAsgmtSubmitted(asgmtId);
    const numReviews = await dbAsgmt.getNumReviewsCompleted(asgmtId);
    const studentData = await dbAsgmt.getClassAsgmtDetails(classId, asgmtId);
    res.status(200).json({classSize, numSubmissions, numReviews, studentData});
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble getting assignments details at the moment. Please try again later.' });
  }
});

asgmt.post('/assignment', mw.checkUserTierOne, async function(req, res) {
  try {
    const classId = req.body.classId;
    const assignment = req.body.assignment;
    const result = await dbAsgmt.createAssignment(classId, assignment);
    if (result.status === 'success') {
      const dirpath = './appdata/classes/' + String(classId);
      const newFolder = String(result.id);
      fs.mkdir(path.join(dirpath, newFolder), { recursive: true }, (err) => {
        if (err) {
          console.log(err)
          res.status(500).json({ status: 'fail', msg: 'We are having trouble creating this assignment at the moment. Please try again later.' });
        }
      })
      res.status(200).json({ status: 'success', msg: 'The assignment has been created.', id: result.id });
    } else {
      res.status(500).json({ status: 'fail', msg: 'We are having trouble creating this assignment at the moment. Please try again later.' });
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble creating this assignment at the moment. Please try again later.' });
  }
});

// add further checks if necessary
asgmt.get('/assignment/reviews', async function(req, res) {
  try {
    const userId = req.session.userId;
    const classId = req.query.classId;
    const asgmtId = req.query.asgmtId;
    const form = await dbAsgmt.getAssignmentFeedbackForm(asgmtId);
    const reviews = await dbAsgmt.getUserReviews(userId, asgmtId);

    let reviewsPack = {
      reviewerId: null,
      reviews: []
    };

    if (reviews.length !== 0) {
      reviewsPack.reviewerId = reviews[0].reviewer_id;
      // Create reviews JSON object
      for (let i = 0; i < reviews.length; i = i + form.length) {
        reviews[i].submission_uri = reviews[i].submission_uri.toString().slice(14);
        reviewsPack.reviews.push({
          submitorId: reviews[i].submitor_id,
          submissionURI: reviews[i].submission_uri,
          completedReview: reviews[i].completedReview
        })
      }
      console.log("reviewsPack")
      console.log(reviewsPack)
    }
    res.status(200).send(reviewsPack);
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble getting your reviews at the moment. Please try again later.' });
  }
});

asgmt.get('/assignment/review', async function(req, res) {
  try {
    const userId = req.session.userId;
    const classId = req.query.classId;
    const asgmtId = req.query.asgmtId;
    const submitorId = req.query.submitorId;
    const form = await dbAsgmt.getAssignmentFeedbackForm(asgmtId);
    const reviews = await dbAsgmt.getReview(userId, asgmtId, submitorId);
    if (reviews.length !== 0) {
      const numReviews = reviews.length / form.length;
      let reviewsPack = {
        reviewerId: reviews[0].reviewer_id,
        submitorId: reviews[0].submitor_id,
        submissionURI: reviews[0].submission_uri,
        form: [],
        data: [],
      };

      for (let i = 0; i < reviews.length; i++) {
        reviewsPack.data.push({
          criteriaNum: reviews[i].criteriaNum,
          comments: reviews[i].comments,
          marksGiven: reviews[i].marksGiven,
          marksMax: reviews[i].marksMax,
          boundary: reviews[i].boundary
        })
      }

      for (let i = 0; i < form.length; i++) {
        reviewsPack.form.push({
          criteriaNum: form[i].criteriaNum,
          criterion: form[i].criterion,
          description: form[i].description,
          marksMax: form[i].marksMax,
        })
      }

      console.log("DONE")
      console.log(reviewsPack)

      res.status(200).send(reviewsPack);
    } else {
      res.sendStatus(404);
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble loading this review at the moment. Please try again later.' });
  }
});

asgmt.put('/assignment/review/save', async function(req, res) {
  try {
    const userId = req.session.userId; //could cross reference with reviewerid
    const classId = req.body.classId;
    const asgmtId = req.body.asgmtId;
    const submitorId = req.body.submitorId;
    const submissionURI = req.body.submissionURI;
    const data = req.body.data;

    const result = await dbAsgmt.saveReview(userId, asgmtId, submitorId, data);
    if (result.status = 'success') {
      return res.status(200).json({ status: 'success', msg: 'The review has been saved.' })
    } else {
      return res.status(200).json({ status: 'error', msg: 'The review has not been saved. Please try again.' })
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble saving this review at the moment. Please try again later.' });
  }
});
// add middleware
asgmt.put('/assignment/review/submit', async function(req, res) {
  try {
    const userId = req.session.userId; //could cross reference with reviewerid
    const classId = req.body.classId;
    const asgmtId = req.body.asgmtId;
    const submitorId = req.body.submitorId;
    const submissionURI = req.body.submissionURI;
    const data = req.body.data;

    const result = await dbAsgmt.submitReview(userId, asgmtId, submitorId, data);
    if (result.status = 'success') {
      return res.status(200).json({ status: 'success', msg: 'The review has been submitted.' })
    } else {
      return res.status(200).json({ status: 'error', msg: 'The review has not been submitted. Please try again.' })
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble submitting this review at the moment. Please try again later.' });
  }
});

asgmt.get('/assignment/feedback', async function(req, res) {
  try {
    const userId = req.session.userId;
    const classId = req.query.classId;
    const asgmtId = req.query.asgmtId;
    const form = await dbAsgmt.getAssignmentFeedbackForm(asgmtId);
    const feedbackRecieved = await dbAsgmt.getUsersFeedback(userId, asgmtId);

    let feedbackPack = {
      submitorId: null,
      criteria: [],
      feedback: []
    };

    if (feedbackRecieved.length !== 0) {
      feedbackPack.submitorId = feedbackRecieved[0].submitor_id;
      const numReviews = feedbackRecieved.length / form.length;
      const classCreator = await dbClass.getClassCreator(classId);

      // Create feedback JSON object
      for (let i = 0; i < form.length; i++) {
        // Enter Criteria data
        feedbackPack.criteria.push({
          criteriaNum: form[i].criteriaNum,
          criterion: form[i].criterion,
          description: form[i].description,
          marksMax: form[i].marksMax
        })
        let criterionFeedback = { criteria: (i+1), data:[] };
        // Enter the data for criteria i per user who has submitted a review
        for (let x = i; x < feedbackRecieved.length; x = x + form.length) {
          let reviewer = "Peer";
          if (classCreator === feedbackRecieved[x].reviewer_id) {
            reviewer = "Teacher";
          }
          criterionFeedback.data.push({
            reviewerTier: reviewer,
            reviewerId: feedbackRecieved[x].reviewer_id,
            criteriaNum: feedbackRecieved[x].criteriaNum,
            comments: feedbackRecieved[x].comments,
            marksGiven: feedbackRecieved[x].marksGiven,
            boundary: feedbackRecieved[x].boundary
          })
        }
        feedbackPack.feedback.push(criterionFeedback);
      }
    }
    console.log(feedbackPack)
    res.status(200).send(feedbackPack);
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble getting the feedback at the moment. Please try again later.' });
  }
});

// Add a check maybe for when the review phase has passed?
asgmt.get('/assignment/results', mw.checkUserTierOne, mw.checkClassOwnership, async function(req, res) {
  try {
    const userId = req.session.userId;
    const classId = req.query.classId;
    const asgmtId = req.query.asgmtId;
    const form = await dbAsgmt.getAssignmentFeedbackForm(asgmtId);
    const studentResults = await dbAsgmt.getStudentResults(classId, asgmtId);
    const classResults = await dbAsgmt.getClassResults(classId, asgmtId);
    res.status(200).json({ classResults: classResults, studentResults: studentResults, criteriaForm: form });
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble getting the results at the moment. Please try again later.' });
  }
});


asgmt.get('/assignment/reviews/given', mw.checkUserTierOne, mw.checkClassOwnership, async function(req, res) {
  try {
    const userId = req.session.userId;
    const classId = req.query.classId;
    const asgmtId = req.query.asgmtId;
    const targetUser = req.query.userId;

    const reviewsGiven = await dbAsgmt.getCompletedUserReviews(targetUser, asgmtId);

    if (reviewsGiven.length !== 0) {
      return res.status(200).send(reviewsGiven);
    } else {
      return res.status(200).json({ status: 'fail', msg: 'This user has not given any feedback.' });
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble getting these reviews at the moment. Please try again later.' });
  }
});

asgmt.get('/assignment/reviews/recieved', mw.checkUserTierOne, mw.checkClassOwnership, async function(req, res) {
  try {
    const userId = req.session.userId;
    const classId = req.query.classId;
    const asgmtId = req.query.asgmtId;
    const targetUser = req.query.userId;

    const reviewsRecieved = await dbAsgmt.getCompletedReviewsForUser(targetUser, asgmtId);

    if (reviewsRecieved.length !== 0) {
      return res.status(200).send(reviewsRecieved);
    } else {
      return res.status(200).json({ status: 'fail', msg: 'This user has not recieved any feedback.' });
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble getting these reviews at the moment. Please try again later.' });
  }
});


/// NEED TO DO ///

// add to check the file they are getting is in their class or their own OR that they are a tier 1 user.
asgmt.get('/assignment/view/:userId/:file', async function(req, res) {
  try {
    const userRequested = req.params.userId;
    const fileId = req.params.file;
    res.sendFile(fileId, { root: path.join('./appdata/users', userRequested) })
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble getting this file at the moment. Please try again later.' });
  }
});

// Good
asgmt.get('/assignment/submission/status', async function(req, res) {
  try {
    const userId = req.session.userId;
    const classId = req.session.classId;
    const asgmtId = req.query.asgmtId;
    const userSubmissionStatus = await dbFile.checkUserSubmissionStatus(userId, asgmtId);
    if (userSubmissionStatus.status === 'exists') {
      const submissionURI = await dbFile.getUserSubmissionURI(userId, asgmtId);
      const uriArray = submissionURI.split('/');
      const filename = uriArray[3].slice(14);
      return res.status(200).send(filename);
    } else {
      return res.status(200).send(null);
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble checking the submission status at the moment. Please try again later.' });
  }
});


asgmt.get('/assignment/download/:classId/:asgmtId/:fileId', mw.checkClassAsgmtUserIntegrity, async function(req, res) {
  try {
    res.download(path.join('./appdata/classes', req.params.classId, req.params.asgmtId, req.params.fileId), req.params.fileId);
  } catch(e) {
    console.log(e);
    res.status(500).json({ status: 'fail', msg: 'We are having trouble getting this attachment at the moment. Please try again later.' });
  }
});

asgmt.post('/assignment/upload/:classId/:asgmtId', upload.array("files", 3), async (req, res, next) => {
  try {
    const files = req.files;
    const classId = req.params.classId;
    const asgmtId = req.params.asgmtId;
    const tmp = './tmp/uploads/';
    const dest = './appdata/classes/';

    for (let i = 0; i < files.length; i++) {
      fs.rename(path.join(tmp, files[i].filename), path.join(dest, classId, asgmtId, files[i].filename), (err) => {
        if (err) {
          console.log(err);
        }
      })
      console.log(path.join(dest, classId, asgmtId, files[i].filename))
      const result = await dbAsgmt.updateFilePath(asgmtId, i, path.join(dest, classId, asgmtId, files[i].filename));
      if (result.status === 'empty') {
        return res.status(500).json({ status: 'fail', msg: 'We are having trouble uploading these files at the moment. Please try again later.' });
      }
    }

    res.status(200).json({ status: 'success', msg: 'Files moved.' });
  } catch (e) {
    console.log(e)
    res.status(500).json({ status: 'fail', msg: 'We are having trouble uploading these files at the moment. Please try again later.' });
  }
});

// mw checking time to see if submissions are allowed
asgmt.post('/assignment/submission/:classId/:asgmtId', mw.checkUserTierZero, mw.checkClassAsgmtUserIntegrity, mw.acceptSubmission, upload.single("file"), async (req, res, next) => {
  try {
    const file = req.file;
    const userId = req.session.userId;
    const classId = req.params.classId;
    const asgmtId = req.params.asgmtId;
    const tmp = './tmp/uploads/';
    const dest = './appdata/users/';

    fs.rename(path.join(tmp, file.filename), path.join(dest, userId, file.filename), (err) => {
      if (err) {
        console.log(err);
      }
    })

    const userSubmission = await dbFile.checkUserSubmissionStatus(userId, asgmtId);
    let result;
    if (userSubmission.status === 'empty') { // Create a new submission
      result = await dbFile.createSubmission(userId, asgmtId, path.join(dest, userId, file.filename));
    } else { // Update the existing submission uri in DB and delete the old file
      const currentURI = await dbFile.getUserSubmissionURI(userId, asgmtId);
      result = await dbFile.updateUserSubmission(userId, asgmtId, path.join(dest, userId, file.filename));
      fs.unlink(currentURI, (err) => {
        if (err) { console.log(err) };
      });
    }
    if (result.status === 'success') {
      return res.status(201).json({ status: 'success', msg: 'Work successfully submitted.' });
    } else {
      return res.status(500).json({ status: 'success', msg: 'We are having trouble submitting this file at the moment. Please try again later.' });
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({ status: 'fail', msg: 'We are having trouble submitting this file at the moment. Please try again later.' });
  }
});

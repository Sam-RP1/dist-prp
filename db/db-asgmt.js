'use strict';

/**
*
* KEY
*
* Status Codes:
*   'success'  - The operation/request was carried out successfully.
*   'fail'     - The operation/request completed successfully, but was unable to find the desired data.
*   'error'    - The operation/request encountered error(s) and was not able to successfully complete the operation/request.
*   'empty'    - The operations/requests result contained nothing and as is therefore empty.
*   'exists'   - The operations/requests result contained result(s) and therefore exists.
*/

//------------- GLOBAL VARIABLES -------------//
const config = require('../config.js');

//------------- FUNCTIONS -------------//
/**
* createAssignment(classId, data) -
* Inserts a new record for a new assignment in the 'assignments' table.
* @param {string} classId The classes id
* @param {JSON} data The data to be used in creating the assignment
* @return {JSON} A status code with the newly made assignment or a status code with an error message
*/
module.exports.createAssignment = async (classId, data) => {
  try {
    const sql = await config.sqlPromise;
    const timeDue = ' 23:59:59'
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const currentDate = date + ' ' + time;
    const newAssignment = {
      cl_id: classId,
      title: data.asgmtName,
      description: data.asgmtDesc,
      setDate: currentDate,
      dueDateSubmissions: data.asgmtWorkDue + timeDue,
      dueDateReviews: data.asgmtReviewsDue + timeDue,
      numReviews: data.asgmtNumReviews,
      resourceOne: data.asgmtResource1,
      resourceTwo: data.asgmtResource2,
      resourceThree: data.asgmtResource3,
      fileOne: data.asgmtFiles[0],
      fileTwo: data.asgmtFiles[1],
      fileThree: data.asgmtFiles[2],
    };

    await sql.query(sql.format('INSERT INTO assignments SET ?', newAssignment));
    const [asgmt] = await sql.query(sql.format('SELECT * FROM assignments WHERE cl_id = ? AND title = ? AND setDate = ?', [classId, data.asgmtName, currentDate]));

    for (let i = 0; i < data.criteria.length; i++) {
      const newFeedback = {
        asgmt_id: asgmt[0].id,
        criteriaNum: i + 1,
        criterion: data.criteria[i].criterion,
        description: data.criteria[i].criterionDescription,
        marksMax: data.criteria[i].criterionMarks
      }
      await sql.query(sql.format('INSERT INTO feedbackForms SET ?', newFeedback));
    }

    return { status: 'success', id: asgmt[0].id };
  } catch (e) {
    console.log(e);
    return { status: 'error', error: e };
  }
}

/**
* createReviews(asgmtId, reviewData, formData) -
* Creates the records for the reviews generated for an assignment
* @param {string} asgmtId The assignments id
* @param {JSON} reviewData
* @param {JSON} formData
* @return {JSON} A status code with the newly made assignment or a status code with an error message
*/
module.exports.createReviews = async (asgmtId, reviewData, formData) => {
  try {
    const sql = await config.sqlPromise;
    // Scenario: Student has to do 2 reviews and each review has 3 criteria
    // For each student in the reviewData
    for (let i = 0; i < reviewData.length; i++) {
      // For each piece of work they have to review
      for (let x = 0; x < reviewData[i].assignedWork.length; x++) {
        // For each criteria of that review
        for (let y = 0; y < formData.length; y++) {
          const newReview = {
            asgmt_id: asgmtId,
            reviewer_id: reviewData[i].reviewerId,
            submitor_id: reviewData[i].assignedWork[x].submitorId,
            submission_uri: reviewData[i].assignedWork[x].submitorWorkUri,
            criteriaNum: formData[y].criteriaNum,
            // comments: ,
            // marksGiven: ,
            marksMax: formData[y].marksMax,
            // boundary: ,
            completedReview: 0,
          };

          await sql.query(sql.format('INSERT INTO reviews SET ?', newReview));
        }
      }
    }

    return { status: 'success' };
  } catch (e) {
    console.log(e);
    return { status: 'error', error: e };
  }
}

/**
* updateFilePath(asgmtId, fileNum, newPath) -
* Updates the file path of an uploaded file for an assignment to its new path.
* @param {string} asgmtId The assignments id
* @param {INT} fileNum The files index number from 0, 1 or 2
* @param {string} newPath The files new path
* @return {JSON} If no error no return, if error status code and message or just a status code
*/
module.exports.updateFilePath = async (asgmtId, fileNum, newPath) => {
  try {
    const sql = await config.sqlPromise;
    let file;
    const [result] = await sql.query(sql.format('Select * FROM assignments WHERE id = ?', [asgmtId]));

    if (fileNum === 0) {
      file = "fileOne";
    } else if (fileNum === 1) {
      file = "fileTwo";
    } else {
      file = "fileThree";
    }

    if (result.length < 1) {
      return { status: 'empty' };
    } else {
      await sql.query(sql.format('UPDATE assignments SET ' + file + ' = ? WHERE id = ?', [newPath, asgmtId]));
      return { status: 'success' };
    }
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* getAssignment(asgmtId) -
* Gets an assignment by querying the 'assignments' table using the assignments id.
* @param {string} asgmtId The assignments id
* @return {JSON} The assignment
*/
module.exports.getAssignment = async (asgmtId) => {
  const sql = await config.sqlPromise;
  const [asgmt] = await sql.query(sql.format('SELECT * FROM assignments WHERE id = ?', [asgmtId]));
  return asgmt;
};

/**
* getAssignmentFeedbackForm(asgmtId) -
* Gets an assignments feedback form by querying the 'feedbackForms' table using the assignments id.
* @param {string} asgmtId The assignments id
* @return {JSON} The assignments feedback form
*/
module.exports.getAssignmentFeedbackForm = async (asgmtId) => {
  const sql = await config.sqlPromise;
  const [form] = await sql.query(sql.format('SELECT * FROM feedbackForms WHERE asgmt_id = ?', [asgmtId]));
  return form;
};

/**
* getAssignmentCompletedReviews(asgmtId) -
* Gets the reviews completed for an assignment by querying the 'reveiws' table using the assignments id.
* @param {string} asgmtId The assignments id
* @return {JSON} The reviews
*/
module.exports.getAssignmentCompletedReviews = async (asgmtId) => {
  const sql = await config.sqlPromise;
  const [reviews] = await sql.query(sql.format('SELECT * FROM reviews WHERE asgmt_id = ? AND completedReview = 1', [asgmtId]));
  return reviews;
};

/**
* getUserReviews(userId, asgmtId) -
* Gets a users reviews for an assignment by querying the 'reveiws' table using the assignments id and users id.
* @param {string} userId The users id
* @param {string} asgmtId The assignments id
* @return {JSON} The reviews
*/
module.exports.getUserReviews = async (userId, asgmtId) => {
  const sql = await config.sqlPromise;
  const [reviews] = await sql.query(sql.format('SELECT * FROM reviews WHERE asgmt_id = ? AND reviewer_id = ?', [asgmtId, userId]));
  return reviews;
};

/**
* getCompletedUserReviews(userId, asgmtId) -
* Gets a users completed reviews for an assignment by querying the 'reveiws' table using the assignments id and users id.
* @param {string} userId The users id
* @param {string} asgmtId The assignments id
* @return {JSON} The reviews
*/
module.exports.getCompletedUserReviews = async (userId, asgmtId) => {
  const sql = await config.sqlPromise;
  const [reviews] = await sql.query(sql.format('SELECT reviewer_id, submitor_id, submission_uri, criteriaNum, comments, marksGiven, marksMax, boundary FROM reviews WHERE asgmt_id = ? AND reviewer_id = ? AND completedReview = 1', [asgmtId, userId]));
  return reviews;
};

/**
* getCompletedUserReviews(userId, asgmtId) -
* Gets a users completed reviews for an assignment by querying the 'reveiws' table using the assignments id and users id.
* @param {string} userId The users id
* @param {string} asgmtId The assignments id
* @return {JSON} The reviews
*/
module.exports.getCompletedReviewsForUser = async (userId, asgmtId) => {
  const sql = await config.sqlPromise;
  const [reviews] = await sql.query(sql.format('SELECT reviewer_id, submitor_id, submission_uri, criteriaNum, comments, marksGiven, marksMax, boundary FROM reviews WHERE asgmt_id = ? AND submitor_id = ? AND completedReview = 1', [asgmtId, userId]));
  return reviews;
};

/**
* getReview(userId, asgmtId, submitorId) -
* Gets a users review for an assignment by querying the 'reveiws' table using the assignments id and users id.
* @param {string} userId The users id
* @param {string} asgmtId The assignments id
* @param {string} submitorId The user id for the works submitor id
* @return {JSON} The reviews
*/
module.exports.getReview = async (userId, asgmtId, submitorId) => {
  const sql = await config.sqlPromise;
  const [reviews] = await sql.query(sql.format('SELECT * FROM reviews WHERE asgmt_id = ? AND reviewer_id = ? AND submitor_id = ?', [asgmtId, userId, submitorId]));
  return reviews;
};

/**
* saveReview(userId, asgmtId, submitorId, data) -
* Saves a review by a user.
* @param {string} userId The users id
* @param {string} asgmtId The assignments id
* @param {string} submitorId The assignments id
* @param {JSON} data The assignments id
* @return {JSON} Status code
*/
module.exports.saveReview = async (userId, asgmtId, submitorId, data) => {
  try {
    const sql = await config.sqlPromise;

    for (let i = 0; i < data.length; i++) {
      await sql.query(sql.format('UPDATE reviews SET comments = ? WHERE asgmt_id = ? AND reviewer_id = ? AND submitor_id = ? AND criteriaNum = ?',
      [data[i].comments, asgmtId, userId, submitorId, data[i].criteriaNum]));
      await sql.query(sql.format('UPDATE reviews SET marksGiven = ? WHERE asgmt_id = ? AND reviewer_id = ? AND submitor_id = ? AND criteriaNum = ?',
      [data[i].marksGiven, asgmtId, userId, submitorId, data[i].criteriaNum]));
      await sql.query(sql.format('UPDATE reviews SET boundary = ? WHERE asgmt_id = ? AND reviewer_id = ? AND submitor_id = ? AND criteriaNum = ?',
      [data[i].boundary, asgmtId, userId, submitorId, data[i].criteriaNum]));
    }
    return { status: 'success' };
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* submitReview(userId, asgmtId, submitorId, data) -
* Submits a review by a user.
* @param {string} userId The users id
* @param {string} asgmtId The assignments id
* @param {string} submitorId The assignments id
* @param {JSON} data The assignments id
* @return {JSON} Status code
*/
module.exports.submitReview = async (userId, asgmtId, submitorId, data) => {
  try {
    const sql = await config.sqlPromise;

    for (let i = 0; i < data.length; i++) {
      await sql.query(sql.format('UPDATE reviews SET comments = ? WHERE asgmt_id = ? AND reviewer_id = ? AND submitor_id = ? AND criteriaNum = ?',
      [data[i].comments, asgmtId, userId, submitorId, data[i].criteriaNum]));
      await sql.query(sql.format('UPDATE reviews SET marksGiven = ? WHERE asgmt_id = ? AND reviewer_id = ? AND submitor_id = ? AND criteriaNum = ?',
      [data[i].marksGiven, asgmtId, userId, submitorId, data[i].criteriaNum]));
      await sql.query(sql.format('UPDATE reviews SET boundary = ? WHERE asgmt_id = ? AND reviewer_id = ? AND submitor_id = ? AND criteriaNum = ?',
      [data[i].boundary, asgmtId, userId, submitorId, data[i].criteriaNum]));
      await sql.query(sql.format('UPDATE reviews SET completedReview = 1 WHERE asgmt_id = ? AND reviewer_id = ? AND submitor_id = ? AND criteriaNum = ?',
      [asgmtId, userId, submitorId, data[i].criteriaNum]));
    }
    return { status: 'success' };
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* getUsersFeedback(userId, asgmtId) -
* Gets a users feedback received from a completed review by querying the 'reveiws' table using the assignments id and users id.
* @param {string} userId The users id
* @param {string} asgmtId The assignments id
* @return {JSON} The review feedback
*/
module.exports.getUsersFeedback = async (userId, asgmtId) => {
  const sql = await config.sqlPromise;
  const [reviews] = await sql.query(sql.format('SELECT * FROM reviews WHERE asgmt_id = ? AND submitor_id = ? AND completedReview = 1', [asgmtId, userId]));
  return reviews;
};

/**
* getAsgmtSubmissionDueTime(asgmtId) -
* Gets the submission deadline for work to be submitted by for an assingment by querying the 'assignments' table using the assignments id.
* @param {string} asgmtId The assignments id
* @return {DATE} The due date and time
*/
module.exports.getAsgmtSubmissionDueTime = async (asgmtId) => {
  const sql = await config.sqlPromise;
  const [asgmt] = await sql.query(sql.format('SELECT dueDateSubmissions FROM assignments WHERE id = ?', [asgmtId]));
  return asgmt[0].dueDateSubmissions;
};

/**
* getAsgmtReviewDueTime(asgmtId) -
* Gets the submission deadline for reviews to be submitted by for an assingment by querying the 'assignments' table using the assignments id.
* @param {string} asgmtId The assignments id
* @return {DATE} The due date and time
*/
module.exports.getAsgmtReviewDueTime = async (asgmtId) => {
  const sql = await config.sqlPromise;
  const [asgmt] = await sql.query(sql.format('SELECT dueDateReviews FROM assignments WHERE id = ?', [asgmtId]));
  return asgmt[0].dueDateReviews;
};

/**
* getNumAsgmtSubmitted(asgmtId) -
* Gets the number of work submitted for a class by querying the 'submissions' table.
* @param {string} asgmtId The assignments id
* @return {INT} The number of work submitted
*/
module.exports.getNumAsgmtSubmitted =  async (asgmtId) => {
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT * FROM submissions WHERE asgmt_id = ?', [asgmtId]));
  return result.length;
};

/**
* getNumReviewsCompleted(asgmtId) -
* Gets the number of reviews completed for a class by querying the 'reviews' table.
* @param {string} asgmtId The assignments id
* @return {INT} The number of reviews completed
*/
module.exports.getNumReviewsCompleted = async (asgmtId) => {
  const sql = await config.sqlPromise;
  const [asgmt] = await sql.query(sql.format('SELECT cl_id FROM assignments WHERE id = ?', [asgmtId]));
  const [asgmtCriteria] = await sql.query(sql.format('SELECT * FROM feedbackForms WHERE asgmt_id = ?', [asgmtId]));
  const [classRegister] = await sql.query(sql.format('SELECT * FROM registers WHERE cl_id = ?', [asgmt[0].cl_id]));

  const numCriteria = asgmtCriteria.length;

  let numReviewsCompleted = 0;

  for (let i=0; i < classRegister.length; i++) { // Do for every user in class
    const [reviews] = await sql.query(sql.format('SELECT * FROM reviews WHERE asgmt_id = ? AND reviewer_id = ?', [asgmtId, classRegister[i].usr_id]));
    const [completedReviews] = await sql.query(sql.format('SELECT * FROM reviews WHERE asgmt_id = ? AND reviewer_id = ? AND completedReview = 1', [asgmtId, classRegister[i].usr_id]));

    if (reviews.length > 0 && completedReviews.length === reviews.length) {
      numReviewsCompleted += 1;
    }
  }
  return numReviewsCompleted;
};

/**
* getClassAsgmtDetails(classId, asgmtId) -
* Gets the complete details for each student in a given classes assignment.
* @param {string} classId The classes id
* @param {string} asgmtId The assignments id
* @return {JSON} A json object containing the full details for the given assignment for every student in the class
*/
module.exports.getClassAsgmtDetails = async (classId, asgmtId) => {
  try {
    const sql = await config.sqlPromise;
    // Step 1. Get all the students for this class from the register.
    const [register] = await sql.query(sql.format('SELECT * FROM registers WHERE cl_id = ?', [classId]));
    const [asgmt] = await sql.query(sql.format('SELECT * FROM assignments WHERE id = ?', [asgmtId]));
    const [asgmtCriteria] = await sql.query(sql.format('SELECT * FROM feedbackForms WHERE asgmt_id = ?', [asgmtId]));
    const numReviews = asgmt[0].numReviews; // num reviews per person to be completed
    const numCriteria = asgmtCriteria.length; // num criteria to be completed per review

    // Step 2. Query all the students submissions from the submissions table to find students who have submitted.
    // Step 3. Query all the students reviews from the reviews table to find the number each student has done.
    let studentData = [];
    for (let i=0; i < register.length; i++) {
      let record;
      let reviewData = [];
      let numReviewsAssigned = 0;
      let numRevCompleted = 0;
      const userId = register[i].usr_id;
      const [userName] = await sql.query(sql.format('SELECT name FROM userDetails WHERE id = ?', [userId]));
      const [submission] = await sql.query(sql.format('SELECT * FROM submissions WHERE asgmt_id = ? AND usr_id = ?', [asgmtId, userId])); // Search for students submission if exists
      const [reviews] = await sql.query(sql.format('SELECT * FROM reviews WHERE asgmt_id = ? AND reviewer_id = ?', [asgmtId, userId])); // Search for students reviews given if exists

      if (reviews.length > 0) {
        for (let x=0; x < reviews.length; x++) {
          const record = {
            recipient: reviews[x].submitor_id,
            criteriaNum: reviews[x].criteriaNum,
            comments: reviews[x].comments,
            marksGiven: reviews[x].marksGiven,
            marksMax: reviews[x].marksMax,
            boundary: reviews[x].boundary,
            completed: reviews[x].completedReview,
          }
          reviewData.push(record)
        }
        const [reviewsCompleted] = await sql.query(sql.format('SELECT * FROM reviews WHERE asgmt_id = ? AND reviewer_id = ? AND completedReview = 1', [asgmtId, userId]));
        numReviewsAssigned = reviews.length / numCriteria;
        numRevCompleted = reviewsCompleted.length / numCriteria;
      }

      if (submission.length === 1) {
        const uriArray = submission[0].uri.split('/');
        const submissionURI = uriArray[2] + '/' + uriArray[3];
        record = { name: userName[0].name, userId: userId, submissionCompleted: 1, submissionURI: submissionURI, reviewsAssigned: numReviewsAssigned, reviewsCompleted: numRevCompleted, reviewData };
      } else {
        record = { name: userName[0].name, userId: userId, submissionCompleted: 0, submissionURI: null, reviewsAssigned: numReviewsAssigned, reviewsCompleted: numRevCompleted, reviewData };
      }
      studentData.push(record)
    }
    return studentData;
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* getClassResults(classId, asgmtId) -
* Gets the results for the class of an assignment.
* @param {string} classId The classes id
* @param {string} asgmtId The assignments id
* @return {JSON} The  results
*/
module.exports.getClassResults = async (classId, asgmtId) => {
  try {
    const sql = await config.sqlPromise;
    const [asgmtCriteria] = await sql.query(sql.format('SELECT * FROM feedbackForms WHERE asgmt_id = ?', [asgmtId]));
    const [reviews] = await sql.query(sql.format('SELECT * FROM reviews WHERE asgmt_id = ? AND completedReview = 1', [asgmtId]));
    const numCriteria = asgmtCriteria.length; // num criteria per review

    let totalMarksAchieved = 0
    let totalMarksMax = 0;
    let marksMax = 0;
    let avgMarksAchieved = 0;
    let avgMarksPercentage = 0;
    let lowestMarksPercentage = 0;
    let lowestMarksAchieved = 0;
    let highestMarksPercentage = 0;
    let highestMarksAchieved = 0;
    let criteriaArray = [];

    // Calculate the classes marks per student
    let marksArray = []
    for (let i = 0; i < reviews.length; i++) {
      const userId = reviews[i].submitor_id;
      let marksGiven = 0;
      let maxMarks = 0;
      let resultPercentage = 0;
      let resultMarks = 0;
      let skip = false;

      for (let x = 0; x < marksArray.length; x++) {
        if (marksArray[x].userId === userId) {
          // Already done this user, lets skip to the next
          skip = true;
        }
      }

      if (skip === true) {
        continue;
      }

      const [feedbackRecieved] = await sql.query(sql.format('SELECT * FROM reviews WHERE asgmt_id = ? AND submitor_id = ? AND completedReview = 1', [asgmtId, userId]));

      for (let i = 0; i < feedbackRecieved.length; i ++) {
        marksGiven += feedbackRecieved[i].marksGiven;
        maxMarks += feedbackRecieved[i].marksMax;
      }

      if (maxMarks !== 0 && marksGiven !== 0) {
        resultPercentage = (marksGiven / maxMarks) * 100;
        resultMarks = marksGiven / (feedbackRecieved.length / numCriteria);
        resultMarks = Math.round(resultMarks * 10) / 10;
      }

      const record = { userId: userId, resultPercentage: resultPercentage, resultMarksAchieved: resultMarks };
      marksArray.push(record)
    }

    for (let i = 0; i < reviews.length; i++) {
      totalMarksMax += reviews[i].marksMax;
    }
    if (totalMarksMax !== 0) {
      marksMax = totalMarksMax / (reviews.length / numCriteria);
    }

    if (marksArray.length > 0) {
      const marks = marksArray.map(d => d.resultMarksAchieved);
      const percentages = marksArray.map(d => d.resultPercentage);
      let marksTotal;
      for ( let i = 0; i < marksArray.length; i++) {
        marksTotal = marks.reduce((a, b) => a + b, 0)
      }
      avgMarksAchieved = marksTotal / marksArray.length; // Find the classes average marks achieved
      avgMarksPercentage = (avgMarksAchieved / marksMax) * 100;
      avgMarksPercentage = Math.round(avgMarksPercentage * 10) / 10;
      lowestMarksAchieved = Math.min(...marks); // Find the classes lowest marks achieved
      lowestMarksPercentage = Math.min(...percentages);
      lowestMarksPercentage = Math.round(lowestMarksPercentage * 10) / 10;
      highestMarksAchieved = Math.max(...marks); // Find the classes highest marks achieved
      highestMarksPercentage = Math.max(...percentages);
      highestMarksPercentage = Math.round(highestMarksPercentage * 10) / 10;
    }

    // Calculate average marks for each criteria
    for (let i = 0; i < numCriteria; i++) {
      const [reviews] = await sql.query(sql.format('SELECT * FROM reviews WHERE asgmt_id = ? AND criteriaNum = ? AND completedReview = 1', [asgmtId, (i + 1)]));
      let totalMarksGiven = 0;
      let totalMarksPossible = 0;
      let avgCriteriaMarks = 0;
      let avgCriteriaPercentage = 0;
      let maxMarksPossible = 0;
      let selectedBoundaries = [];

      for (let x = 0; x < reviews.length; x++) {
        totalMarksGiven += reviews[x].marksGiven;
        totalMarksPossible += reviews[x].marksMax;
        selectedBoundaries.push(reviews[x].boundary)
      }

      if (totalMarksGiven !== 0 && totalMarksMax !== 0) {
        let marksplaceholder = totalMarksGiven / reviews.length;
        avgCriteriaMarks = Math.round(marksplaceholder * 10) / 10;
        maxMarksPossible = totalMarksPossible / reviews.length;
        avgCriteriaPercentage = (marksplaceholder / maxMarksPossible) * 100;
        avgCriteriaPercentage = Math.round(avgCriteriaPercentage * 10) / 10;
      }

      criteriaArray.push({ criteriaNum: (i + 1), maxMarks: maxMarksPossible, avgMarksAchieved: avgCriteriaMarks, avgMarksPercentage: avgCriteriaPercentage, boundaries: selectedBoundaries })
    }

    return {
      marksMax: marksMax,
      avgMarksPercentage: avgMarksPercentage,
      avgMarksAchieved: avgMarksAchieved,
      lowestMarksPercentage: lowestMarksPercentage,
      lowestMarksAchieved: lowestMarksAchieved,
      highestMarksPercentage: highestMarksPercentage,
      highestMarksAchieved: highestMarksAchieved,
      criteria: criteriaArray
    };
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* getStudentResults(classId, asgmtId) -
* Gets the results for students in an assignment.
* @param {string} classId The classes id
* @param {string} asgmtId The assignments id
* @return {ARRAY} The students results
*/
module.exports.getStudentResults = async (classId, asgmtId) => {
  try {
    const sql = await config.sqlPromise;
    // Step 1. Get all the students for this class from the register.
    const [register] = await sql.query(sql.format('SELECT * FROM registers WHERE cl_id = ?', [classId]));
    const [asgmtCriteria] = await sql.query(sql.format('SELECT * FROM feedbackForms WHERE asgmt_id = ?', [asgmtId]));
    const numCriteria = asgmtCriteria.length; // num criteria per review

    // Step 2. Query all the students submissions from the submissions table to find students who have submitted.
    // Step 3. Query all the students reviews from the reviews table to find the number each student has done.
    let studentData = [];
    for (let i=0; i < register.length; i++) {
      let record;
      const userId = register[i].usr_id;
      const [userName] = await sql.query(sql.format('SELECT name FROM userDetails WHERE id = ?', [userId]));
      const [submission] = await sql.query(sql.format('SELECT * FROM submissions WHERE asgmt_id = ? AND usr_id = ?', [asgmtId, userId])); // Search for students submission if exists
      const [feedbackRecieved] = await sql.query(sql.format('SELECT * FROM reviews WHERE asgmt_id = ? AND submitor_id = ? AND completedReview = 1', [asgmtId, userId])); // Search for students reviews given if exists
      let marksGiven = 0;
      let maxMarks = 0;
      for (let i = 0; i < feedbackRecieved.length; i ++) {
        marksGiven += feedbackRecieved[i].marksGiven;
        maxMarks += feedbackRecieved[i].marksMax;
      }
      let resultPercentage;
      let resultMarks;
      if (maxMarks === 0 && marksGiven === 0) {
        resultPercentage = 0;
        resultMarks = 0;
      } else {
        resultPercentage = (marksGiven / maxMarks) * 100;
        resultPercentage = Math.round(resultPercentage * 10) / 10;
        resultMarks = (marksGiven / (feedbackRecieved.length / numCriteria)) + " / " + (maxMarks / (feedbackRecieved.length / numCriteria))
      }

      if (submission.length === 1) {
        const uriArray = submission[0].uri.split('/');
        const submissionURI = uriArray[2] + '/' + uriArray[3];
        record = { name: userName[0].name, userId: userId, submissionURI: submissionURI, resultPercentage: resultPercentage, resultMarks: resultMarks };
      } else {
        record = { name: userName[0].name, userId: userId, submissionURI: null, resultPercentage: resultPercentage, resultMarks: resultMarks };
      }
      studentData.push(record)
    }
    return studentData;
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* checkAsgmtId(asgmtId) -
* Checks if an assignment id exists by querying the 'assignments' table.
* @param {string} asgmtId The assignments id
* @return {JSON} A status code
*/
module.exports.checkAsgmtId = async (asgmtId) => {
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT EXISTS(SELECT 1 FROM assignments WHERE id = ?) AS sysCheck', [asgmtId]));
  if (result[0].sysCheck === 1) {
    return { status: 'exists' }
  } else {
    return { status: 'empty' }
  }
};

/**
* checkUserInClass(userId, asgmtId) -
* Checks if a user has submitted work for an assignment by querying the 'submissions' table.
* @param {string} userId The users id
* @param {string} asgmtId The assignments id
* @return {JSON} A status code
*/
module.exports.checkUserSubmittedWork = async (userId, asgmtId) => {// Check if they exist as a pair in the submitted table
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT * FROM submissions WHERE asgmt_id = ? AND usr_id = ?', [asgmtId, userId]));
  if (result.length === 1) {
    return { status: 'exists' }
  } else {
    return { status: 'empty' }
  }
};

/**
* checkUserCompletedReviews(userId, asgmtId) -
* Checks if a user has completed their allocated reviews for an assignment by querying the 'reviews' table.
* @param {string} userId The users id
* @param {string} asgmtId The assignments id
* @return {JSON} A status code
*/
module.exports.checkUserCompletedReviews = async (userId, asgmtId) => {// Check if they exist x num times in the reviews table
  const sql = await config.sqlPromise;
  const [reviews] = await sql.query('SELECT * FROM reviews WHERE asgmt_id = ? AND reviewer_id = ?', [asgmtId, userId]);

  if (reviews.length > 0) {
    const [completedReviews] = await sql.query(sql.format('SELECT * FROM reviews WHERE asgmt_id = ? AND reviewer_id = ? AND completedReview = 1', [asgmtId, userId]));

    if (completedReviews.length === reviews.length) {
      return { status: 'exists' }
    } else {
      return { status: 'empty' }
    }
  } else {
    console.log("No reviews assigned yet.")
    return { status: 'empty' }
  }
};

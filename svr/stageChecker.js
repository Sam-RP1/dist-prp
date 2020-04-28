'use strict';

//------------- GLOBAL VARIABLES -------------//
const express = require('express');
const fs = require('fs');
const path = require('path');
const shuffle = require('shuffle-array');
const config = require('../config.js');
const dbClass = require('../db/db-class.js');
const dbAsgmt = require('../db/db-asgmt.js');

//------------- FUNCTIONS -------------//
/**
* checkAssignmentsPhase() -
* Queries the 'assignments' table for records where the 'dueDateSubmissions' is between the current date and current date - 1 day.
* This finds the active assignments whos submission period for work has concluded, meaning the reviews phase of the assignment begins now.
* The function then passes these assignment records to the function 'generateReviews', to generate the reviews for that assignment.
*/
module.exports.checkAssignmentsPhase = async () => {
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT * FROM assignments WHERE dueDateSubmissions BETWEEN CURDATE() - INTERVAL 1 DAY AND CURDATE()'));
  for (let i = 0; i < result.length; i++) {
    await generateReviews(result[i]);
  }
};

/**
* generateReviews(asgmt) -
* Generates the reviews for a given assignment.
* @param {JSON} asgmt The JSON object for an assignment, contains the assignments full details
*/
async function generateReviews(asgmt) {
  // Variables
  const asgmtId = asgmt.id;
  const classId = asgmt.cl_id;
  const numReviewsPP = asgmt.numReviews; // Number of reviews for each student to be assigned
  const sql = await config.sqlPromise;
  const [creatorId] = await sql.query(sql.format('SELECT creator_id FROM classes WHERE id = ?', [classId]));
  const [register] = await sql.query(sql.format('SELECT usr_id FROM registers WHERE cl_id = ?', [classId]));
  const [workSubmitted] = await sql.query(sql.format('SELECT usr_id, uri FROM submissions WHERE asgmt_id = ?', [asgmtId]));
  const [feedbackForm] = await sql.query(sql.format('SELECT criteriaNum, marksMax FROM feedbackForms WHERE asgmt_id = ?', [asgmtId]));
  const classSize = register.length;
  const numWorkSubmitted = workSubmitted.length;
  let data = []; // array to store the data to generate reviews from
  let workArray = []; // array to store the submitted work for the assignment

  // Algorithms to shuffle and assign the submitted work to students in the class
  if (classSize === 0) {
    console.log("Class has no students. Reviews cannot be assigned.")
  } else if (classSize === 1 && (numWorkSubmitted === classSize || numWorkSubmitted < classSize)) {
    console.log("Class has a single student. Reviews cannot be assigned.")
  } else if (numWorkSubmitted === 0) {
    console.log("Class has students. No work has been submitted. Reviews cannot be assigned.")
  } else if (numWorkSubmitted > numReviewsPP) {
    // Algorithm to use when the amount of work submitted exceeds the number of reviews per person
    let studentArray = []; // Array to store the student data
    let backupStudentArray = []; // Used to store a copy of the original unmodified 'studentArray'
    let backupWorkArray = []; // Used to store a copy of the original unmodified 'workArray'

    // For loops to generate arrays of data
    for (let i = 0; i < classSize; i++) {
      const record = { reviewerId: register[i].usr_id, assignedWork: [] }
      studentArray.push(record);
      backupStudentArray.push(record);
    }
    for (let i = 0; i < workSubmitted.length; i++) {
      const record = { usr_id: workSubmitted[i].usr_id, uri: workSubmitted[i].uri, counter: 0 };
      workArray.push(record);
    }
    shuffle(workArray); // Shuffle the 'workArray'
    for (let i = 0; i < workArray.length; i++) {
      // Back up the shuffled 'workArray'
      backupWorkArray.push(workArray[i]);
    }
    let noMatch = 0; // A counter used for when a student <---> work relationship is not possible
    let target = numReviewsPP;

    while (studentArray.length > 0) {
      for (let i = 0; i < workArray.length; i++) {
        workArray[i].counter = 0;
      }
      for (let i = 0; i < numWorkSubmitted; i++) {
        const work = workArray[i];
        let toggleTarget = false;

        while (work.counter < target) {
          if (studentArray.length === 0) {
            break;
          }
          let student = shuffle.pick(studentArray);

          const studentApproved = await checkStudentAssignable(work, student, studentArray);

          if (studentApproved === true) {
            if (student.assignedWork.length < numReviewsPP) {
              student.assignedWork.push({ submitorId: work.usr_id, submitorWorkUri: work.uri });
              work.counter += 1;
            }
          } else if (data.length >= 2 && student.assignedWork.length === (numReviewsPP - 1)) {
            let i = 0;
            // for all i in data array
            while (i < data.length) {
              // for all assigned work in data[i]
              for (let x = 0; x < data[i].assignedWork.length; x++) {
                // If the work id we found does not equal ours and the work we have to swap does not equal theirs
                if (data[i].assignedWork[x].submitorId !== student.reviewerId && work.usr_id !== data[i].reviewerId) {
                  let checkNotAssignedToCurrent = false;
                  let checkNotAssignedToThem = false;
                  let firstCounter = 0;
                  let secondCounter = 0;
                  // for each piece of work the current student has
                  for (let z = 0; z < student.assignedWork.length; z++) {
                    // if the work we are looking to swap for does NOT match any we have currently
                    if (data[i].assignedWork[x].submitorId !== student.assignedWork[z].submitorId) {
                      firstCounter += 1;
                    }
                    if (firstCounter === student.assignedWork.length) {
                      checkNotAssignedToCurrent = true;
                    }
                  }
                  // for each piece of work the other student has
                  for (let z = 0; z < data[i].assignedWork.length; z++) {
                    // if the work we need to swap does not match any of theirs
                    if (work.usr_id !== data[i].assignedWork[z].submitorId) {
                      secondCounter += 1;
                    }
                    if (secondCounter === data[i].assignedWork.length) {
                      checkNotAssignedToThem = true;
                    }
                  }
                  if (checkNotAssignedToCurrent === true && checkNotAssignedToThem === true) {
                    const temp = data[i].assignedWork[x];
                    student.assignedWork.push(temp);
                    let holder = data[i].assignedWork;
                    holder.splice(x, 1)
                    data[i].assignedWork = holder;
                    data[i].assignedWork.push({ submitorId: work.usr_id, submitorWorkUri: work.uri });
                    work.counter += 1;

                    i += classSize;
                    break;
                  } else {
                    noMatch += 1;
                  }
                } else {
                  noMatch += 1;
                }
              }
              i += 1;
            }
          } else {
            let studentCounter = 0;
            for (let i = 0; i < studentArray.length; i++) {
              // Check each student left
              for (let x = 0; x < studentArray[i].assignedWork.length; x++) {
                if (studentArray[i].assignedWork[x].submitorId === work.usr_id) {
                  studentCounter += 1;
                }
              }
            }
            if (studentCounter !== studentArray.length) {
            } else {
              let i = 0;
              while (i < data.length) {
                // for all assigned work in data[i]
                for (let x = 0; x < data[i].assignedWork.length; x++) {
                  // If the work id we found does not equal ours and the work we have to swap does not equal theirs
                  if (data[i].assignedWork[x].submitorId !== student.reviewerId && work.usr_id !== data[i].reviewerId) {
                    let checkNotAssignedToCurrent = false;
                    let checkNotAssignedToThem = false;
                    let firstCounter = 0;
                    let secondCounter = 0;
                    // for each piece of work the current student has
                    for (let z = 0; z < student.assignedWork.length; z++) {
                      // if the work we are looking to swap for does NOT match any we have currently
                      if (data[i].assignedWork[x].submitorId !== student.assignedWork[z].submitorId) {
                        firstCounter += 1;
                      }
                      if (firstCounter === student.assignedWork.length) {
                        checkNotAssignedToCurrent = true;
                      }
                    }
                    // for each piece of work the other student has
                    for (let z = 0; z < data[i].assignedWork.length; z++) {
                      // if the work we need to swap does not match any of theirs
                      if (work.usr_id !== data[i].assignedWork[z].submitorId) {
                        secondCounter += 1;
                      }
                      if (secondCounter === data[i].assignedWork.length) {
                        checkNotAssignedToThem = true;
                      }
                    }
                    if (checkNotAssignedToCurrent === true && checkNotAssignedToThem === true) {
                      const temp = data[i].assignedWork[x];
                      student.assignedWork.push(temp);
                      let holder = data[i].assignedWork;
                      holder.splice(x, 1)
                      data[i].assignedWork = holder;
                      data[i].assignedWork.push({ submitorId: work.usr_id, submitorWorkUri: work.uri });
                      work.counter += 1;

                      i += classSize;
                      break;
                    } else {
                      noMatch += 1;
                    }
                  } else {
                    noMatch += 1;
                  }
                }
                i += 1;
              }
            }

          }
          if (student.assignedWork.length === numReviewsPP) {
            data.push(student);
            const indexNum = studentArray.findIndex(x => x.reviewerId === student.reviewerId)
            studentArray.splice(indexNum, 1);
          }
          if (noMatch >= (classSize * numReviewsPP)) {
            toggleTarget = true;
            studentArray = [];
            workArray = [];
            data = [];
            for (let i = 0; i < backupStudentArray.length; i++) {
              studentArray.push(backupStudentArray[i]);
            }
            for (let i = 0; i < backupWorkArray.length; i++) {
              workArray.push(backupWorkArray[i]);
            }
            noMatch = 0;
            break;
          }
        }
        if (toggleTarget === true) {
          target = numReviewsPP
        } else {
          target = 1;
        }
      }
    }
  } else {
    // Algorithm to use when the amount of work submitted exceeds the number of reviews per person
    for (let i = 0; i < workSubmitted.length; i++) {
      const record = { usr_id: workSubmitted[i].usr_id, uri: workSubmitted[i].uri, counter: 0 };
      workArray.push(record);
    }

    shuffle(workArray);

    for (let i = 0; i < classSize; i++) {
      const studentId = register[i].usr_id;
      let studentRecord = { reviewerId: register[i].usr_id, assignedWork: [] }
      let breakCounter = 0;
      let breakLimit;

      if (workArray.find(x => x.usr_id === studentId)) {
        breakLimit = numWorkSubmitted - 1;
      } else {
        breakLimit = numWorkSubmitted;
      }

      while (studentRecord.assignedWork.length < breakLimit) {
        let work = shuffle.pick(workArray);
        work, workApproved = await checkWorkAssignable(work, workArray, numReviewsPP, studentRecord);

        if (workApproved === true) {
          studentRecord.assignedWork.push({ submitorId: work.usr_id, submitorWorkUri: work.uri });
          work.counter += 1;
        }
      }
      data.push(studentRecord);
    }
  }

  // Check if reviews have been generated
  if (data.length > 0) {
    let teacherRecord = { reviewerId: creatorId[0].creator_id, assignedWork: [] }

    for (let i = 0; i < numWorkSubmitted; i++) {
      teacherRecord.assignedWork.push({ submitorId: workArray[i].usr_id, submitorWorkUri: workArray[i].uri });
    }
    data.push(teacherRecord)

    let formData = [];
    for (let i = 0; i < feedbackForm.length; i++) {
      const criteriaRecord = { criteriaNum: feedbackForm[i].criteriaNum, marksMax: feedbackForm[i].marksMax }
      formData.push(criteriaRecord);
    }

    const result = await dbAsgmt.createReviews(asgmtId, data, formData)
    if (result.status === 'success') {
      console.log("Reviews generated successfully.")
    } else {
      console.log("Reviews generation failed.")
    }
  } else {
    console.log("Reviews not generated for this assignment.")
  }
}

/**
* checkWorkAssignable(work, workArray, numReviewsPP, studentRecord) -
* Checks if a piece of work can be assigned to a given student.
* @param {JSON} work The work
* @param {Array} workArray The array containing all the work
* @param {Int} numReviewsPP The number of reviews per person to be assigned
* @param {JSON} studentRecord The data for a student
* @return {JSON, Boolean} Work and either true or false, return work, true; OR return work, false;
*/
async function checkWorkAssignable(work, workArray, numReviewsPP, studentRecord) {
  // Check the selected work is not the students own work
  const checkNotStudents = await checkWorkNotStudents(work, studentRecord);
  if (checkNotStudents === false) { // Work selected is the students
    return work, false;
  }
  const checkNotAssigned = await checkWorkNotAssigned(work, studentRecord);
  if (checkNotAssigned === false) { // Work already assigned to student for review
    return work, false;
  }

  if (work.counter === 0) { // Work not assigned yet.
    return work, true;
  } else { // Checking if work is most suitable to assignable to student
    for (let i = 0; i < workArray.length; i++) {
      const checkNotAssigned = await checkWorkNotAssigned(workArray[i], studentRecord);
      if (workArray[i].counter < work.counter && workArray[i].usr_id !== studentRecord.reviewerId && checkNotAssigned === true) {
        work = workArray[i];
      }
    }
    return work, true;
  }
}

/**
* checkWorkNotStudents(work, studentRecord) -
* Checks if a piece of work is not a students own work.
* @param {JSON} work The work
* @param {JSON} studentRecord The data for a student
* @return {Boolean} true or false
*/
async function checkWorkNotStudents(work, studentRecord) {
  const answer = (work.usr_id !== studentRecord.reviewerId) ? true : false;
  return answer;
}

/**
* checkWorkNotAssigned(work, studentRecord) -
* Checks if a piece of work is not already assigned to a student for review.
* @param {JSON} work The work
* @param {JSON} studentRecord The data for a student
* @return {Boolean} true or false
*/
async function checkWorkNotAssigned(work, studentRecord) {
  for (let i = 0; i < studentRecord.assignedWork.length; i++) {
    if (work.usr_id === studentRecord.assignedWork[i].submitorId) {
      return false;
    }
  }
  return true;
}

/**
* checkStudentAssignable(work, student, studentArray) -
* Checks if a student can be assigned a specific piece of work
* @param {JSON} work The data for a piece of work
* @param {JSON} student The data for a student
* @param {Array} studentArray The array containing all the work
* @return {Boolean} true or false
*/
async function checkStudentAssignable(work, student, studentArray) {
  // Check the selected work is not the students own work
  const checkNotStudents = await checkWorkNotStudents(work, student);
  if (checkNotStudents === false) { // Work selected is the students
    return false;
  }
  const checkNotAssigned = await checkWorkNotAssigned(work, student);
  if (checkNotAssigned === false) { // Work already assigned to student for review
    return false;
  }
  if (work.counter === 0) {
    return true;
  } else {
    for (let i = 0; i < studentArray.length; i++) {
      const checkNotAssigned = await checkWorkNotAssigned(work, studentArray[i]);
      if (studentArray[i].assignedWork.length < student.assignedWork.length && work.usr_id !== studentArray[i].reviewerId && checkNotAssigned === true) {
        return false;
      }
    }
    return true;
  }
}

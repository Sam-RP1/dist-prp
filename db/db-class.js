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
* createClass(id, name, unitCode, userId) -
* Inserts a new record for a new class in the 'classes' table.
* @param {string} id The classes id
* @param {string} name The classes name
* @param {string} unitCode The classes unit code
* @param {string} userId The id of the user who created the class
* @return {JSON} A status code or a status code with an error message
*/
module.exports.createClass = async (id, name, unitCode, userId) => {
  try {
    const sql = await config.sqlPromise;
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const currentDate = date + ' ' + time;
    const newClass = {
      id: id,
      name: name,
      unitCode: unitCode,
      creator_id: userId,
      dateCreated: currentDate
    };
    // sanitise the user input data
    await sql.query(sql.format('INSERT INTO classes SET ?', newClass));
    return { status: 'success' };
  } catch (e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* addUserToClass(userId, classId) -
* Inserts a new record into the 'registers' table to add a user to a class.
* @param {string} userId The users id
* @param {string} classId The classes id
* @return {JSON} A status code or a status code with an error message
*/
module.exports.addUserToClass = async (userId, classId) => {
  try {
    const sql = await config.sqlPromise;
    const newRecord = {
      cl_id: classId,
      usr_id: userId,
    };
    // sanitise the user input data
    await sql.query(sql.format('INSERT INTO registers SET ?', newRecord));
    return { status: 'success' };
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* leaveClass(userId, classId) -
* Deletes a record from the 'registers' table to remove a user from a class.
* @param {string} userId The users id
* @param {string} classId The classes id
* @return {JSON} A status code or a status code with an error message
*/
module.exports.leaveClass = async (userId, classId) => {
  try {
    const sql = await config.sqlPromise;
    await sql.query(sql.format('DELETE FROM registers WHERE usr_id = ? AND cl_id = ?', [userId, classId]));
    // do an if statement search here to ensure deletion has happened
    return { status: 'success' }
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* deleteClass(userId, classId) -
* Deletes a record from the 'classes' table to permanently delete a class.
* @param {string} userId The users id
* @param {string} classId The classes id
* @return {JSON} A status code or a status code with an error message
*/
module.exports.deleteClass = async (userId, classId) => {
  try {
    const sql = await config.sqlPromise;
    await sql.query(sql.format('DELETE FROM classes WHERE creator_id = ? AND id = ?', [userId, classId]));
    return { status: 'success' }
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* getClassNameAndCode(classId) -
* Gets a classes name and unitCode by querying the 'classes' table.
* @param {string} classId The classes id
* @return {JSON} The classes name and unitCode
*/
module.exports.getClassNameAndCode = async (classId) => {
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT * FROM classes WHERE id = ?', [classId]));
  const classNameAndCode = { name: result[0].name, unitCode: result[0].unitCode }
  return classNameAndCode;
};

/**
* getClassSize(classId) -
* Gets a classes size by querying the 'registers' table for the number of records.
* @param {string} classId The classes id
* @return {INT} The classes size
*/
module.exports.getClassSize = async (classId) => {
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT * FROM registers WHERE cl_id = ?', [classId]));
  return result.length;
};

module.exports.getClassCreator = async (classId) => {
  const sql = await config.sqlPromise;
  const [classCreator] = await sql.query(sql.format('SELECT creator_id FROM classes WHERE id = ?', [classId]));
  return classCreator[0].creator_id;
}

/**
* getClassRegister(classId) -
* Gets the name and email for each member in a given classes register by querying the 'registers' and 'userDetails' tables.
* @param {string} classId The classes id
* @return {JSON} The classes register
*/
module.exports.getClassRegister = async (classId) => {
  const sql = await config.sqlPromise;
  const [register] = await sql.query(sql.format('SELECT * FROM registers WHERE cl_id = ?', [classId]));

  let dataList = [];

  for (let i = 0; i < register.length; i++) {
    const [user] = await sql.query(sql.format('Select * FROM userDetails WHERE id = ?', [register[i].usr_id]));
    const userData = { name: user[0].name, email: user[0].email }
    dataList.push(userData);
  }

  return dataList;
};

/**
* getClassUserIds(classId) -
* Gets the name and email for each member in a given classes register by querying the 'registers' and 'userDetails' tables.
* @param {string} classId The classes id
* @return {JSON} The classes register
*/
module.exports.getClassUserIds = async (classId) => {
  const sql = await config.sqlPromise;
  const [register] = await sql.query(sql.format('SELECT usr_id FROM registers WHERE cl_id = ?', [classId]));
  return register;
};

/**
* getClassAssignments(classId) -
* Gets a classes assignments by querying the 'assignments' table using the classes id.
* @param {string} classId The classes id
* @return {JSON} The assignments
*/
module.exports.getClassAssignments = async (classId) => {
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT * FROM assignments WHERE cl_id = ?', [classId]));
  return result;
};

module.exports.getClassSubmissions = async (classId) => {
  // Get all the assignments for a class
  // Then get all the submissions for each assignment in a class (USERID, [SUBMISSION URI'S])
  // return JSON of [{USERID, [URIS]}, ...]
  try {
    const sql = await config.sqlPromise;
    const [assignments] = await sql.query(sql.format('SELECT id FROM assignments WHERE cl_id = ?', [classId]));
    let result = [];
    for (let i = 0; i < assignments.length; i++) {
      const asgmtId = assignments[i].id;
      const [submissions] = await sql.query(sql.format('SELECT usr_id, uri FROM submissions WHERE asgmt_id = ?', [asgmtId]));
      result.push(submissions);
    }
    return result;
  } catch(e){
    console.log(e)
    return { status: 'error', error: e }
  }
};

/**
* getNumAsgmt(classId) -
* Gets the number of assignments ever set in a class by querying the 'assignments' table.
* @param {string} classId The classes id
* @return {INT} The number of assignments
*/
module.exports.getNumAsgmt = async (classId) => {
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT * FROM assignments WHERE cl_id = ?', [classId]));
  return result.length;
};

/**
* getNumActiveAsgmt(classId) -
* Gets the number of active assignments in a class by querying the 'assignments' table.
* @param {string} classId The classes id
* @return {INT} The number of active assignments
*/
module.exports.getNumActiveAsgmt = async (classId) => {
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT * FROM assignments WHERE cl_id = ? AND dueDateSubmissions > DATE(NOW())', [classId]));
  return result.length;
};

/**
* getNumActiveRev(classId) -
* Gets the number of active reviews in a class by querying the 'assignments' table.
* @param {string} classId The classes id
* @param {string} userId The users id
* @return {INT} The number of active reviews
*/
module.exports.getNumActiveRev = async (classId, userId) => {
  const sql = await config.sqlPromise;
  // query the reviews table for records from assignments that are active,
  // these records need to match the asgmtid the userid and not be completed = 1 (so 0)
  const [result] = await sql.query(sql.format('SELECT id FROM assignments WHERE cl_id = ? AND dueDateReviews > DATE(NOW())', [classId]));
  console.log("TESTING")
  console.log(result)
  let numReviews = 0;
  for (let i = 0; i < result.length; i++) {
    const [asgmtCriteria] = await sql.query(sql.format('SELECT * FROM feedbackForms WHERE asgmt_id = ?', [result[i].id]));
    const [reviews] = await sql.query('SELECT * FROM reviews WHERE asgmt_id = ? AND reviewer_id = ? AND completedReview = 0', [result[i].id, userId]);
    numReviews = numReviews + (reviews.length / asgmtCriteria.length);
  }

  return numReviews;
};

/**
* getNumPastAsgmt(classId) -
* Gets the number of past assignments in a class by querying the 'assignments' table.
* @param {string} classId The classes id
* @return {INT} The number of past assignments
*/
module.exports.getNumPastAsgmt = async (classId) => {
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT * FROM assignments WHERE cl_id = ? AND dueDateSubmissions < DATE(NOW())', [classId]));
  return result.length;
};

/**
* checkClassId(classId) -
* Checks if a class id exists by querying the 'classes' table.
* @param {string} classId The classes id
* @return {JSON} A status code
*/
module.exports.checkClassId = async (classId) => {
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT EXISTS(SELECT 1 FROM classes WHERE id = ?) AS sysCheck', [classId]));
  if (result[0].sysCheck === 1) {
    return { status: 'exists' }
  } else {
    return { status: 'empty' }
  }
};

module.exports.checkUserClassCreator = async (classId, userId) => {
  const sql = await config.sqlPromise;
  const [classCreator] = await sql.query(sql.format('SELECT creator_id FROM classes WHERE id = ?', [classId]));
  console.log("CREATOR")
  console.log(classCreator[0].creator_id)
  if (classCreator[0].creator_id === userId) {
    return { status: 'exists' }
  } else {
    return { status: 'empty' }
  }
}

/**
* checkUserInClass(userId, userTier, classId) -
* Checks if a user is in a class by querying the 'registers' or 'classes' table depending on the users tier.
* @param {string} userId The users id
* @param {INT} userTier The users tier
* @param {string} classId The classes id
* @return {JSON} A status code
*/
module.exports.checkUserInClass = async (userId, userTier, classId) => {
  const sql = await config.sqlPromise;
  console.log("This is checking a user is in a class.")
  if (userTier === 1) {
    console.log("The user is a tier 1 user.")
    const [result] = await sql.query(sql.format('SELECT EXISTS(SELECT 1 FROM classes WHERE id = ? AND creator_id = ?) AS sysCheck', [classId, userId]));
    if (result[0].sysCheck === 1) {
      return { status: 'exists' }
    } else {
      return { status: 'empty' }
    }
  } else {
    console.log("The user is a tier 0 user.")
    const [result] = await sql.query(sql.format('SELECT EXISTS(SELECT 1 FROM registers WHERE cl_id = ? AND usr_id = ?) AS sysCheck', [classId, userId]));
    if (result[0].sysCheck === 1) {
      return { status: 'exists' }
    } else {
      return { status: 'empty' }
    }
  }
};

/**
* checkAsgmtInClass(classId, asgmtId) -
* Checks if a assignment is in a class by querying the 'assignments' table.
* @param {string} classId The classes id
* @param {string} asgmtId The assignments id
* @return {JSON} A status code
*/
module.exports.checkAsgmtInClass = async (classId, asgmtId) => {
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT EXISTS(SELECT 1 FROM assignments WHERE id = ? AND cl_id = ?) AS sysCheck', [asgmtId, classId]));
  if (result[0].sysCheck === 1) {
    return { status: 'exists' }
  } else {
    return { status: 'empty' }
  }
};

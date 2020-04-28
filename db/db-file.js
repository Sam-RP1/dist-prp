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
* checkFile(filePath, asgmtId) -
* Checks if a file exists by querying the 'assignments' table.
* @param {string} filePath The files path
* @param {string} asgmtId The assignments id
* @return {JSON} A status code
*/
module.exports.checkFile = async (filePath, asgmtId) => {
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT EXISTS(SELECT 1 FROM assignments WHERE id = ?) AS sysCheck', [asgmtId]));
  if (result[0].sysCheck === 1) {
    return { status: 'exists' }
  } else {
    return { status: 'empty' }
  }
};

/**
* createSubmission(userId, asgmtId, uri) -
* Creates a new record for a users submission in the 'submissions' table.
* @param {JSON} userId The users id
* @param {JSON} asgmtId The asgmts id
* @param {JSON} uri The files uri
* @return {JSON} A status code or a status code with an error message
*/
module.exports.createSubmission = async (userId, asgmtId, uri) => {
  try {
    const sql = await config.sqlPromise;
    const newRecord = {
      asgmt_id: asgmtId,
      usr_id: userId,
      uri: uri,
    };
    await sql.query(sql.format('INSERT INTO submissions SET ?', newRecord));
    return { status: 'success' };
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* updateUserSubmission(userId, asgmtId, uri) -
* Updates an existing record for a users submission in the 'submissions' table.
* @param {JSON} userId The users id
* @param {JSON} asgmtId The asgmts id
* @param {JSON} uri The files uri
* @return {JSON} A status code or a status code with an error message
*/
module.exports.updateUserSubmission = async (userId, asgmtId, uri) => {
  try {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('Select * FROM submissions WHERE asgmt_id = ? AND usr_id = ?', [asgmtId, userId]));

    if (result.length === 1) {
      await sql.query(sql.format('UPDATE submissions SET uri = ? WHERE asgmt_id = ? AND usr_id = ?', [uri, asgmtId, userId]));
    } else {
      return { status: 'empty' };
    }
    return { status: 'success' };
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* updateUserSubmission(userId, asgmtId, uri) -
* Gets an existing submissions URI for a users submission in the 'submissions' table.
* @param {JSON} userId The users id
* @param {JSON} asgmtId The asgmts id
* @return {String} The submissions URI
*/
module.exports.getUserSubmissionURI = async (userId, asgmtId) => {
  try {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('Select * FROM submissions WHERE asgmt_id = ? AND usr_id = ?', [asgmtId, userId]));
    return result[0].uri;
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* checkUserSubmissionStatus(userId, asgmtId) -
* Check is a user has submitted work or not for an assignment by querying the 'submissions' table.
* @param {JSON} userId The users id
* @param {JSON} asgmtId The asgmts id
* @return {String} A status code
*/
module.exports.checkUserSubmissionStatus = async (userId, asgmtId) => {
  try {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('Select * FROM submissions WHERE asgmt_id = ? AND usr_id = ?', [asgmtId, userId]));

    if (result.length < 1) {
      return { status: 'empty' };
    } else {
      return { status: 'exists' };
    }
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

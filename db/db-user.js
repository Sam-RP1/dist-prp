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
* createUser(data) -
* Creates a new record for a new user in the 'userDetails' table and a new cookie in the 'userCookie' table.
* @param {JSON} data The users details
* @return {JSON} A status code or a status code with an error message
*/
module.exports.createUser = async (data) => {
  try {
    const sql = await config.sqlPromise;
    const newRecord = {
      id: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture,
      tier: 0
    };
    const newCookie = {
      usr_id: data.id,
      cookieData: ''
    };
    await sql.query(sql.format('INSERT INTO userDetails SET ?', newRecord));
    await sql.query(sql.format('INSERT INTO userCookie SET ?', newCookie));
    return { status: 'success' };
  } catch (e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* updateUserRecord(data) -
* Updates a users record in the 'userDetails' table.
* @param {JSON} data The users details to be updated
* @return {JSON} A status code or a status code with an error message
*/
module.exports.updateUserRecord = async (data) => {
  try {
    const sql = await config.sqlPromise;

    const [result] = await sql.query(sql.format('Select * FROM userDetails WHERE id = ?', [data.id]));

    if (result.length === 1) {
      await sql.query(sql.format('UPDATE userDetails SET email = ?, name = ?, picture = ? WHERE id = ?', [data.email, data.name, data.picture, data.id]));
    } else {
      return { status: 'empty' };
    }
  } catch (e) {
    console.log(e)
    return { status: 'error', error: e };
  }
};

/**
* updateUserCookie(data) -
* Updates a users cookie data in the 'userCookie' table.
* @param {JSON} userId The users id
* @param {JSON} data The data to be updated
* @return {JSON} A status code or a status code with an error message
*/
module.exports.updateUserCookie = async (userId, data) => {
  try {
    const sql = await config.sqlPromise;

    const [result] = await sql.query(sql.format('Select * FROM userCookie WHERE usr_id = ?', [userId]));

    if (result.length === 1) {
      await sql.query(sql.format('UPDATE userCookie SET cookieData = ? WHERE usr_id = ?', [data, userId]));
      return { status: 'success' }
    } else {
      return { status: 'empty' };
    }
  } catch (e) {
    console.log(e)
    return { status: 'error', error: e };
  }
};

/**
* getUserRecord(userId) -
* Gets a users record from the 'userDetails' table.
* @param {JSON} userId The users id
* @return {JSON} A status code and the users record or a status code or a status code with an error message
*/
module.exports.getUserRecord = async (userId) => {
  try {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('SELECT * FROM userDetails WHERE id = ?', [userId]));
    if (result.length === 1) {
      return { status: 'success', id: result[0].id, email: result[0].email, name: result[0].name, picture: result[0].picture, tier: result[0].tier };
    } else {
      return { status: 'fail' };
    }
  } catch (e) {
    console.log(e)
    return { status: 'error', error: e };
  }
};

/**
* getUserCookie(userId) -
* Gets a users cookie data from the 'userCookie' table.
* @param {JSON} userId The users id
* @return {JSON} A status code and the users cookie or a status code or a status code with an error message
*/
module.exports.getUserCookie = async (userId) => {
  try {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('SELECT * FROM userCookie WHERE usr_id = ?', [userId]));
    if (result.length === 1) {
      return { status: 'success', data: result[0].cookieData };
    } else {
      return { status: 'fail' };
    }
  } catch (e) {
    console.log(e)
    return { status: 'error', error: e };
  }
};

/**
* getUserProfile(userId) -
* Gets a users profile from the 'userDetails' table.
* @param {JSON} userId The users id
* @return {JSON} A status code and the users profile or a status code or a status code with an error message
*/
module.exports.getUserProfile = async (userId) => {
  try {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('SELECT * FROM userDetails WHERE id = ?', [userId]));
    if (result.length === 1) {
      return { status: 'success', email: result[0].email, name: result[0].name, picture: result[0].picture, tier: result[0].tier };
    } else {
      return { status: 'fail' };
    }
  } catch (e) {
    console.log(e)
    return { status: 'error', error: e };
  }
};

/**
* getUserEmail(userId) -
* Gets a users email from the 'userDetails' table.
* @param {JSON} userId The users id
* @return {JSON} A status code and the users email or a status code or a status code with an error message
*/
module.exports.getUserEmail = async (userId) => {
  try {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('SELECT email FROM userDetails WHERE id = ?', [userId]));
    if (result.length === 1) {
      return { status: 'success', email: result[0].email };
    } else {
      return { status: 'fail' };
    }
  } catch (e) {
    console.log(e)
    return { status: 'error', error: e };
  }
};

/**
* getUserName(userId) -
* Gets a users name from the 'userDetails' table.
* @param {JSON} userId The users id
* @return {JSON} A status code and the users name or a status code or a status code with an error message
*/
module.exports.getUserName = async (userId) => {
  try {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('SELECT name FROM userDetails WHERE id = ?', [userId]));
    if (result.length === 1) {
      return { status: 'success', name: result[0].name };
    } else {
      return { status: 'fail' };
    }
  } catch (e) {
    console.log(e)
    return { status: 'error', error: e };
  }
};

/**
* getUserAvatar(userId) -
* Gets a users avatar from the 'userDetails' table.
* @param {JSON} userId The users id
* @return {JSON} A status code and the users avatar or a status code or a status code with an error message
*/
module.exports.getUserAvatar = async (userId) => {
  try {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('SELECT picture FROM userDetails WHERE id = ?', [userId]));
    if (result.length === 1) {
      return { status: 'success', picture: result[0].picture };
    } else {
      return { status: 'fail' };
    }
  } catch (e) {
    console.log(e)
    return { status: 'error', error: e };
  }
};

/**
* getUserTier(userId) -
* Gets a users tier from the 'userDetails' table.
* @param {JSON} userId The users id
* @return {JSON} A status code and the users tier or a status code or a status code with an error message
*/
module.exports.getUserTier = async (userId) => {
  try {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('SELECT tier FROM userDetails WHERE id = ?', [userId]));
    if (result.length === 1) {
      return { status: 'success', tier: result[0].tier };
    } else {
      return { status: 'fail' };
    }
  } catch (e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* getUserClasses(userId, userTier) -
* Gets a users classes from either just the 'classes' table or the 'registers' and 'classes' tables.
* @param {JSON} userId The users id
* @param {JSON} userTier The users tier
* @return {JSON} The users classes or a status code with an error message
*/
module.exports.getUserClasses = async (userId, userTier) => {
  try {
    const sql = await config.sqlPromise;
    let classes = [];

    if (userTier === 1) { // If user is Tier 1 we can skip the register querying step as this user made the class
      const [result] = await sql.query(sql.format('SELECT * FROM classes WHERE creator_id = ?', [userId]));
      for (let i = 0; i < result.length; i++) {
        const row = {
          id: result[i].id,
          name: result[i].name,
          unitCode: result[i].unitCode,
          dateCreated: result[i].dateCreated,
        }
        classes.push(row);
      }
    } else {
      const [result] = await sql.query(sql.format('SELECT cl_id FROM registers WHERE usr_id = ?', [userId]));
      for (let i = 0; i < result.length; i++) {
        const [classInfo] = await sql.query(sql.format('SELECT * FROM classes WHERE id = ?', [result[i].cl_id]))
        const row = {
          id: classInfo[0].id,
          name: classInfo[0].name,
          unitCode: classInfo[0].unitCode,
          dateCreated: result[i].dateCreated,
        }
        classes.push(row);
      }
    }
    return classes;
  } catch(e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

/**
* checkUserId(userId) -
* Checks if a user id exists by querying the 'userDetails' table.
* @param {string} userId The users id
* @return {JSON} A status code
*/
module.exports.checkUserId = async (userId) => {
  const sql = await config.sqlPromise;
  const [result] = await sql.query(sql.format('SELECT EXISTS(SELECT 1 FROM userDetails WHERE id = ?) AS sysCheck', [userId]));
  if (result[0].sysCheck === 1) {
    return { status: 'exists' }
  } else {
    return { status: 'empty' }
  }
};

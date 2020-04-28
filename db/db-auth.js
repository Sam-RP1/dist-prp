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
* checkPostFix(postfix) -
* Checks the postfix of an email to see if it is approved and if so what its tier is by querying the 'emailWhitelist' table.
* @param {string} postfix The emails postfix
* @return {JSON} The approval and tier
*/
module.exports.checkPostFix = async (postfix) => {
  const sql = await config.sqlPromise;

  const [result] = await sql.query(sql.format('SELECT * FROM emailWhitelist WHERE postfix = ?', [postfix]));

  if (result.length === 1) {
    return { approved: result[0].approved, tier: result[0].tier }
  } else {
    return { approved: 0, tier: 0 }
  }
};

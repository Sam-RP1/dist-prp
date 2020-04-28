/**
* routes/api/class/index.js
**/
const ClassRouter = require('express').Router();

ClassRouter.route('/assignments')
  .get(require('./class.js'))

ClassRouter.route('/details')
  .get(require('./class.js'))

ClassRouter.route('/create')
  .post(require('./class.js'))

ClassRouter.route('/join')
  .post(require('./class.js'))

ClassRouter.route('/leave')
  .delete(require('./class.js'))

ClassRouter.route('/delete')
  .delete(require('./class.js'))

module.exports = ClassRouter;

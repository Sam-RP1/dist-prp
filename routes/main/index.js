/**
* routes/main/index.js
**/
const MainRouter = require('express').Router();

MainRouter.route('/')
  .get(require('./main.js'))

MainRouter.route('/dashboard')
  .get(require('./main.js'))

MainRouter.route('/class')
  .get(require('./main.js'))

MainRouter.route('/assignment')
  .get(require('./main.js'))

module.exports = MainRouter;

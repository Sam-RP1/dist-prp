/**
* routes/auth/index.js
**/
const AuthRouter = require('express').Router();

AuthRouter.route('/login')
  .post(require('./login.js'))

AuthRouter.route('/logout')
  .post(require('./logout.js'))

module.exports = AuthRouter;

/**
* routes/api/user/index.js
**/
const UserRouter = require('express').Router();

UserRouter.route('/profile')
  .get(require('./user'))

UserRouter.route('/email')
  .get(require('./user'))

UserRouter.route('/name')
  .get(require('./user'))

UserRouter.route('/avatar')
  .get(require('./user'))

UserRouter.route('/tier')
  .get(require('./user'))

UserRouter.route('/classes')
  .get(require('./user'))

UserRouter.route('/manual/view')
  .get(require('./user'))

UserRouter.route('/cookie/data')
  .put(require('./user'))

module.exports = UserRouter;

/**
* routes/api/index.js
**/
const APIRouter = require('express').Router();

APIRouter.use('/user', require('./user'));
APIRouter.use('/class', require('./class'));

APIRouter.route('/assignment')
  .get(require('./assignment.js'))
  .post(require('./assignment.js'))

APIRouter.route('/assignment/details')
  .get(require('./assignment.js'))

APIRouter.route('/assignment/reviews')
  .get(require('./assignment.js'))

APIRouter.route('/assignment/review')
  .get(require('./assignment.js'))

APIRouter.route('/assignment/review/save')
  .put(require('./assignment.js'))

APIRouter.route('/assignment/review/submit')
  .put(require('./assignment.js'))

APIRouter.route('/assignment/reviews/given')
  .get(require('./assignment.js'))

APIRouter.route('/assignment/reviews/recieved')
  .get(require('./assignment.js'))

APIRouter.route('/assignment/feedback')
  .get(require('./assignment.js'))

APIRouter.route('/assignment/results')
  .get(require('./assignment.js'))

APIRouter.route('/assignment/submission/status')
  .get(require('./assignment.js'))

APIRouter.route('/assignment/upload/:classId/:asgmtId')
  .post(require('./assignment.js'))

APIRouter.route('/assignment/download/:classId/:asgmtId/:file')
  .get(require('./assignment.js'))

APIRouter.route('/assignment/view/:userId/:file')
  .get(require('./assignment.js'))

APIRouter.route('/assignment/submission/:classId/:asgmtId')
  .post(require('./assignment.js'))

module.exports = APIRouter;

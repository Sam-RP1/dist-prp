const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('../../config.js');
const mw = require('../../middleware.js');

const main = express.Router();

module.exports = main;

main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: true }));
main.use(session(config.cookie));

main.get('/', mw.redirectDashboard, (req, res) => {
  res.sendFile(path.join(__dirname, '../../', 'src/html/index.html'));
});

main.get('/dashboard', mw.checkUserAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../', 'src/html/dashboard.html'));
});

main.get('/class', mw.checkUserAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../', 'src/html/class.html'));
});

main.get('/assignment', mw.checkUserAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../', 'src/html/assignment.html'));
});

'use strict';

//------------- GLOBAL VARIABLES -------------//
const express = require('express');
const session = require('express-session');
const fs = require('fs')
const https = require('https')
const path = require('path');
const schedule = require('node-schedule');
const checker = require(path.join(__dirname, 'stageChecker.js'))
const config = require('../config.js');
const middleware = require('../middleware.js');
const app = express();
require('dotenv').config()
require('../routes')(app);

app.use(session(config.cookie))
app.use(express.static(path.join(__dirname, '../src'))); // static directories for production

//------------- SERVER -------------//
const port = process.env.PORT || 443;

https.createServer({
  key: fs.readFileSync(path.join(__dirname,'server.key')),
  cert: fs.readFileSync(path.join(__dirname,'server.cert'))
}, app)
.listen(port, function () {
  console.log(`app listening on port ${port}`);
})

//------------- Scheduled Jobs -------------//
const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 15;

const stageChecker = schedule.scheduleJob(rule, function () {
  checker.checkAssignmentsPhase();
});

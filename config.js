'use strict';

//------------- GLOBAL VARIABLES -------------//
const session = require('express-session');
const mysql = require('mysql2/promise');
const MySQLStore = require('express-mysql-session')(session);
const {OAuth2Client} = require('google-auth-library');
require('dotenv').config();

const dbInfo = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: 'prp_DB'
};
const sessionStore = new MySQLStore(dbInfo);

module.exports.sqlPromise = mysql.createConnection(dbInfo);
module.exports.gClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
module.exports.cookie = {
  name: process.env.SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESS_SECRET,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    sameSite: true,
    secure: true,
  }
};

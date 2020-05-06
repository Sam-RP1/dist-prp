-- Used to create the database if it does not already exist
CREATE DATABASE if not exists prp_DB CHARACTER SET utf8;

CREATE TABLE if not exists prp_DB.userDetails(
  id VARCHAR(25) NOT NULL,
  email VARCHAR(50) NOT NULL,
  name VARCHAR(75) NOT NULL,
  picture VARCHAR(1000) NOT NULL,
  tier INT(1) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE if not exists prp_DB.userCookie(
  usr_id VARCHAR(25) NOT NULL,
  cookieData VARCHAR(5000) NOT NULL,
  PRIMARY KEY (usr_id),
  FOREIGN KEY (usr_id)
    REFERENCES userDetails(id)
    ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE if not exists prp_DB.classes(
  id VARCHAR(8) NOT NULL,
  name VARCHAR(20) NOT NULL,
  unitCode VARCHAR(10) NOT NULL,
  creator_id VARCHAR(25) NOT NULL,
  dateCreated DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (creator_id)
    REFERENCES userDetails(id)
) ENGINE=INNODB;

CREATE TABLE if not exists prp_DB.registers(
  id INT NOT NULL AUTO_INCREMENT,
  cl_id VARCHAR(8) NOT NULL,
  usr_id VARCHAR(25) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (cl_id)
    REFERENCES classes(id)
    ON DELETE CASCADE,
  FOREIGN KEY (usr_id)
    REFERENCES userDetails(id)
    ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE if not exists prp_DB.assignments(
  id INT NOT NULL AUTO_INCREMENT,
  cl_id VARCHAR(8) NOT NULL,
  title VARCHAR(20) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  setDate DATETIME NOT NULL,
  dueDateSubmissions DATETIME NOT NULL,
  dueDateReviews DATETIME NOT NULL,
  numReviews INT NOT NULL,
  resourceOne VARCHAR(150),
  resourceTwo VARCHAR(150),
  resourceThree VARCHAR(150),
  fileOne VARCHAR(100) NOT NULL,
  fileTwo VARCHAR(100),
  fileThree VARCHAR(100),
  PRIMARY KEY (id),
  FOREIGN KEY (cl_id)
    REFERENCES classes(id)
    ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE if not exists prp_DB.feedbackForms(
  id INT NOT NULL AUTO_INCREMENT,
  asgmt_id INT NOT NULL,
  criteriaNum INT NOT NULL,
  criterion VARCHAR(20) NOT NULL,
  description VARCHAR(500) NOT NULL,
  marksMax INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (asgmt_id)
    REFERENCES assignments(id)
    ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE if not exists prp_DB.submissions(
  id INT NOT NULL AUTO_INCREMENT,
  asgmt_id INT NOT NULL,
  usr_id VARCHAR(25) NOT NULL,
  uri VARCHAR(200) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (asgmt_id)
    REFERENCES assignments(id)
    ON DELETE CASCADE,
  FOREIGN KEY (usr_id)
    REFERENCES userDetails(id)
    ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE if not exists prp_DB.reviews(
  id INT NOT NULL AUTO_INCREMENT,
  asgmt_id INT NOT NULL,
  reviewer_id VARCHAR(25) NOT NULL,
  submitor_id VARCHAR(25) NOT NULL,
  submission_uri VARCHAR(200) NOT NULL,
  criteriaNum INT NOT NULL,
  comments VARCHAR(300),
  marksGiven INT,
  marksMax INT NOT NULL,
  boundary INT,
  completedReview INT(1) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (asgmt_id)
    REFERENCES assignments(id)
    ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id)
    REFERENCES userDetails(id)
    ON DELETE CASCADE,
  FOREIGN KEY (submitor_id)
    REFERENCES userDetails(id)
    ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE if not exists prp_DB.studentResults(
  id INT NOT NULL AUTO_INCREMENT,
  asgmt_id INT NOT NULL,
  usr_id VARCHAR(25) NOT NULL,
  sub_uri VARCHAR(100) NOT NULL,
  marksGiven INT NOT NULL,
  marksMax INT NOT NULL,
  percentage INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (asgmt_id)
    REFERENCES assignments(id)
    ON DELETE CASCADE,
  FOREIGN KEY (usr_id)
    REFERENCES userDetails(id)
    ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE if not exists prp_DB.emailWhitelist(
  postfix VARCHAR(30) NOT NULL,
  approved INT(1) NOT NULL,
  tier INT(1) NOT NULL,
  PRIMARY KEY (postfix)
) ENGINE=INNODB;

use prp_DB

insert into emailWhitelist (postfix, approved, tier) values ('gmail.com', 1, 0);
insert into emailWhitelist (postfix, approved, tier) values ('myport.ac.uk', 1, 0);
insert into emailWhitelist (postfix, approved, tier) values ('port.ac.uk', 1, 1);

insert into userDetails (id, email, name, picture, tier) values ('106644921453795263497', 'srenshawpanting@gmail.com', 'Samuel R-P', 'https://lh3.googleusercontent.com/a-/AAuE7mDF2rVHdi_KCsL0GXcT2F-k5YD4ZBXG1fxCfCxx=s96-c', 1);
insert into userDetails (id, email, name, picture, tier) values ('104446480448480249739', 'up863457@myport.ac.uk', 'Samuel Renshaw-panting', 'https://lh3.googleusercontent.com/a-/AAuE7mDF2rVHdi_KCsL0GXcT2F-k5YD4ZBXG1fxCfCxx=s96-c', 0);

insert into userCookie (usr_id, cookieData) values ('106644921453795263497', '');
insert into userCookie (usr_id, cookieData) values ('104446480448480249739', '');

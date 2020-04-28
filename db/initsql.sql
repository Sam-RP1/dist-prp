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
insert into userDetails (id, email, name, picture, tier) values ('100996484354974684418', 'samsstealthstorage@gmail.com', 'Sam R-P', 'https://lh3.googleusercontent.com/a-/AAuE7mDF2rVHdi_KCsL0GXcT2F-k5YD4ZBXG1fxCfCxx=s96-c', 0);

insert into userCookie (usr_id, cookieData) values ('106644921453795263497', '');
insert into userCookie (usr_id, cookieData) values ('104446480448480249739', '');
insert into userCookie (usr_id, cookieData) values ('100996484354974684418', '');

insert into classes (id, name, unitCode, creator_id, dateCreated) values ('A100B200', 'Trial Class', 'U0000001', '106644921453795263497', '2019-03-10 12:00:00');

insert into registers (id, cl_id, usr_id) values (1, 'A100B200', '104446480448480249739');
insert into registers (id, cl_id, usr_id) values (2, 'A100B200', '100996484354974684418');

insert into assignments (id, cl_id, title, description, setDate, dueDateSubmissions, dueDateReviews, numReviews, resourceOne, fileOne) values (1, 'A100B200', 'Trial 1', 'Welcome to an assignment. This assignment has been set up for use as a tool during demonstrations, test runs and trials. In an assignment you as a user can find the details for the assignment, the method for submitting work, the pieces of work you will need to peer review and your results from reviews once they are finished by your fellow peers.', '2020-03-10 12:00:00', '2020-03-25 23:59:59', '2020-04-1 23:59:59', 1, 'peerreviewportal.co.uk/', 'appdata/classes/A100B200/1/trialMarkScheme.pdf');
insert into assignments (id, cl_id, title, description, setDate, dueDateSubmissions, dueDateReviews, numReviews, resourceOne, fileOne) values (2, 'A100B200', 'Trial 0', 'Welcome to an assignment. This assignment has been set up for use as a tool during demonstrations, test runs and trials. In an assignment you as a user can find the details for the assignment, the method for submitting work, the pieces of work you will need to peer review and your results from reviews once they are finished by your fellow peers.', '2020-03-10 12:00:00', '2020-03-20 23:59:59', '2020-03-21 23:59:59', 1, 'peerreviewportal.co.uk/', 'appdata/classes/A100B200/2/trialMarkScheme.pdf');

insert into feedbackForms (id, asgmt_id, criteriaNum, criterion, description, marksMax) values (1, 1, 1, "Introduction", "Does the piece of work have a clearly written and in-depth introduction?", 10);
insert into feedbackForms (id, asgmt_id, criteriaNum, criterion, description, marksMax) values (2, 1, 2, "References", "Does the piece of work make use of references? (By the way these descriptions are optional and do not have to be included by your classes teacher.)", 5);
insert into feedbackForms (id, asgmt_id, criteriaNum, criterion, description, marksMax) values (3, 2, 1, "Introduction", "Does the piece of work have a clearly written and in-depth introduction?", 10);
insert into feedbackForms (id, asgmt_id, criteriaNum, criterion, description, marksMax) values (4, 2, 2, "References", "Does the piece of work make use of references? (By the way these descriptions are optional and do not have to be included by your classes teacher.)", 5);

insert into submissions (id, asgmt_id, usr_id, uri) values (1, 1, '104446480448480249739', 'appdata/users/104446480448480249739/1584881945546-work-1.pdf');
insert into submissions (id, asgmt_id, usr_id, uri) values (2, 1, '100996484354974684418', 'appdata/users/100996484354974684418/1584881945546-work-2.pdf');

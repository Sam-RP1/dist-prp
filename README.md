# Peer Review Portal

## Setup Guide

### Requirements
- Linux Debian Ver 9.0 or newer OR Ubuntu 16.04 or newer
- A command line interface text editor of your choice
- Node.js Ver 10.0 or newer
- NPM (Node Package Manager)
- A MySQL Database 
  - IF the databse will be running on the same machine as the applciation please use MariaDB
  - ELSE if the database will be running on a third party service make sure it is using MySQL

### Download
To download the Peer Review Portal application access your command line interface and enter...
```
$ git clone https://github.com/Sam-RP1/prp-dist.git
```

### Database
If the database will be installed on the same machine as the application please install [MariaDB](https://mariadb.com/kb/en/getting-installing-and-upgrading-mariadb/). Then, once installed and setup, skip the rest of this section and move on to "Installing the Application".

Else, if the database will be running on a third party service follow the steps below.

1. Connect to your third party database services via its command line interface.
2. Open the "initsql.sql" file located at "/prp-dist/db/initsql.sql".
3. Copy and paste the contents of the "initsql.sql" file into the command line interface of your third party database service.
4. Then in the command line type and enter...
```
use prp_DB
```
Then type and enter...
```
show tables
```
...and there should be the following tables...
- assignments
- classes
- emailWhitelist
- feedbackforms
- registers
- reviews
- studentresults
- submissions
- usercookie
- userdetails

You have successfully setup the Peer Review Portal database.

### Setting Up the Application
To set up the Peer Review Portal application please follow the steps below.

1. Access your command line interface and open the files downloaded earlier on by entering...
```
$ cd prp-dist
```

2. Next, using your command line text editor of choice open the ".env" file...
```
$ nano .env
```
In the .env file you will need to fill your details for all of the variables that are empty. These are...
- SESS_SECRET: The secret used to encryt the applications cookies
- DB_HOST: The host IP address of your database. If it is running on the same machine type "localhost" here.
- DB_USER: The database user. This has to be the databases root user.
- DB_PWD: The databases password.
- GOOGLE_CLIENT_ID: Your Google client ID that will be used for the Google Login. If you do not have one, create one at the [Google Developer Console](https://console.developers.google.com/)
Then once completed save and exit the ".env" file.

3. (OPTIONAL) If you are using a local database on the same machine open the "package.json" file using your command line text editor of choice...
```
$ nano package.json
```
...and change the username and password on line 8 for the npm setup command to your root database username and password. Then save and exit the file.

4. Now, navigate to the applications html files by entering...
```
$ cd src/html
```
...then open each one of the html files using your command line interface text editor and change the "content=''" on line 11 for the "google-signin-client_id=''" to your Google Client ID...
```
$ nano index.html
```
```
$ nano dashboard.html
```
```
$ nano class.html
```
```
$ nano assignment.html
```

5. Next, return to the "prp-dist" folder and install the applications required packages by entering...
```
$ cd ../../
```
...then...
```
$ npm install
```

### Running the Application
To run the application follow the steps below.

1. Enter the applications folder by entering...
```
$ cd prp-dist
```

2. Then enter the following...
```
sudo npm start
```

The Peer Review Portal should now be running on port 443!

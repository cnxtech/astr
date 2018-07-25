# Archiving System of Test Results (A.S.T.R.)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Description of the tool](#description-of-the-tool)
  - [Global architecture](#global-architecture)
  - [Website](#website)
  - [User privileges](#user-privileges)
  - [Techs used](#techs-used)
  - [Useful tools](#useful-tools)
- [Installation](#installation)
  - [1. Install MongoDB](#1-install-mongodb)
  - [2. Launch MongoDB](#2-launch-mongodb)
  - [3. Create the database](#3-create-the-database)
  - [4. Install Node.js](#4-install-nodejs)
  - [5. Clone the repository](#5-clone-the-repository)
  - [6. Install the modules](#6-install-the-modules)
  - [7. Launch the application](#7-launch-the-application)
  - [8. Create the first Admin](#8-create-the-first-admin)
  - [9. Monitor the application (optional)](#9-monitor-the-application-optional)
- [Authentification](#authentification)
  - [Request Header](#request-header)
  - [Tokens](#tokens)
    - [Description](#description)
    - [Expiration](#expiration)
- [Python library](#python-library)
  - [Purpose](#purpose)
  - [Installation](#installation-1)
  - [Configuration](#configuration)
  - [Basic usage](#basic-usage)
- [API endpoints](#api-endpoints)
    - [Tests](#tests)
    - [Test subjects](#test-subjects)
    - [Search](#search)
    - [Users](#users)
    - [Upload](#upload)
    - [Download](#download)
    - [Stats](#stats)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description of the tool

### Global architecture
![global architecture](https://gitlab.aldebaran.lan/hardware-test/astr/raw/dev/img/global_architecture.png)

### Website

The website is currently hosted on the IVV server at this address: [10.0.160.147:8000](http://10.0.160.147:8000/).

Here are the main features:
![website architecture](https://gitlab.aldebaran.lan/hardware-test/astr/raw/dev/img/website_architecture.png)

### User privileges

![user privieges](https://gitlab.aldebaran.lan/hardware-test/astr/raw/dev/img/user_privileges.png)

### Techs used

- NoSQL database: [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/en/)
    - [express](https://www.npmjs.com/package/express) *(to build web application and API)*
    - [express-session](https://www.npmjs.com/package/express-session) *(to handle user session)*
    - [cookie-parser](https://www.npmjs.com/package/cookie-parser) *(to handle cookies)*
    - [mongodb](https://www.npmjs.com/package/mongodb) and [connect-mongo](https://www.npmjs.com/package/connect-mongo) *(to access the database)*
    - [mongoose](https://www.npmjs.com/package/mongoose) *(to easily make queries on the database)*
    - [bcrypt](https://www.npmjs.com/package/bcrypt) *(to encrypt passwords)*
    - [md5](https://www.npmjs.com/package/md5) *(to encrypt tokens)*
    - [uuid](https://www.npmjs.com/package/uuid) *(to generate Universally Unique Identifier)*
    - [multer](https://www.npmjs.com/package/multer) *(to upload files on the server)*
    - [archiver](https://www.npmjs.com/package/archiver) *(to zip the files)*
    - [diskspace](https://www.npmjs.com/package/diskspace) *(to have information about the disk usage of the server)*
    - [get-folder-size](https://www.npmjs.com/package/get-folder-size) *(to know the size of a folder)*
    - [nodemon](https://www.npmjs.com/package/nodemon) *(for development, to restart automatically the application when a file is changed)*
    - [pm2](https://www.npmjs.com/package/pm2) *(for production, to restart automatically the application if it crashes)*

### Useful tools

- [Postman](https://www.getpostman.com/) *(best GUI to make HTTP requests, useful to try queries on the API)*
- [Robo 3T](https://robomongo.org/) *(GUI for MongoDB)*

## Installation

To deploy the application on a server, follow these steps.

On the server:

### 1. Install MongoDB

- [Ubuntu 14.04 / 16.04](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
- [Debian 7 / 8 / 9](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/)

### 2. Launch MongoDB

- Open a terminal and run

```
sudo service mongod start
```

### 3. Create the database

- Open a Mongo Client in the terminal
```
mongo
```

- Create the database
```
use ASTR
```

- We need to insert a document to complete the creation of the database. Let's insert an empty document in the collection "uselesscollection"
```
db.uselesscollection.insert({})
```

- Now, check that the database is in the list of existing dbs
```
show dbs
```

### 4. Install Node.js

:warning: Install the lastest version of Node.js, don't take the LTS version.

- Follow [this](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) tutorial.

### 5. Clone the repository

```
git clone git@gitlab.aldebaran.lan:hardware-test/astr.git
```

### 6. Install the modules

- In your terminal, move to the folder of the repository
- At the root of the folder run
```
npm install
```

- It will install all the Node.js modules used in the application (listed in [package.json](https://gitlab.aldebaran.lan/hardware-test/astr/blob/master/package.json))

- Install [pm2](https://www.npmjs.com/package/pm2) module
```
npm install pm2 -g
```

### 7. Launch the application

- At the root of the folder run
```
npm run prod
```
*:arrow_right_hook: This command starts the application with [pm2](https://www.npmjs.com/package/pm2) at port 8000.*

- Or (for development only)
```
npm run dev
```
*:arrow_right_hook:	This command starts the application with [nodemon](https://www.npmjs.com/package/nodemon) at port 8000.*

- To use a different port, launch the application as follow
```
# for production
npm run prod -- -- 3000
# for development
npm run dev 3000
```

- To stop the server in production mode
```
npm stop
# OR
pm2 delete {pm2_processs_id}
```

### 8. Create the first Admin

**From your personal computer, open the website** (serverIP:8000)
- Click on *Login*
- Click on *Register an Account*
- Fulfill the form to create your account (it will create a simple user without any permission)

**From the server, open a terminal**
- Open the mongoDB client
```
mongo
```

- Switch to ASTR database
```
use ASTR
```

- Update your account with full privileges
```
db.users.update({"email": "yourEmail"}, {"$set": {"master": true, "write_permission": true}})
```

- That's it! You are now a "Master", that means you can modify directly users permissions on the website

### 9. Monitor the application (optional)

- If you started the application with `npm run prod`, you can monitor it by running
```
pm2 monit
```

- You will be able to see some informations like the application logs, the CPU utilization, the number of restarts, etc.

## Authentification

Some requests to the API require authentification. A website user doesn't need to worry about it because it is completely transparent and handled with cookies. But a script user will have to authentificate to do some actions.

### Request Header

To verify that the user has the required authorizations, he has to authentificate in the request header with his email and one of his tokens, using [Basic authentication](https://en.wikipedia.org/wiki/Basic_access_authentication).

```
Authorization: Basic email:token
```

If the user doesn't authentificate or give a wrong token, an 401 error (Unauthorized) will be return.

An example with curl:
```
curl -X DELETE \
     -u john.doe@softbankrobotics.com:d2147e39-8b6e-4c7b-b4ca-f93529dfbbd1 \
      http://10.0.160.147:8000/api/tests/id/5b19442c5dd23f39e6f5e6d8
```

In the [Python library](https://gitlab.aldebaran.lan/hardware-test/astr/tree/master/lib-python-astr), everything is already handled by [client.py](https://gitlab.aldebaran.lan/hardware-test/astr/blob/master/lib-python-astr/libastr/client.py). The user only needs to configure his environment variables (cf. [configuration](#configuration))

### Tokens

#### Description

Tokens are [uuid](https://en.wikipedia.org/wiki/Universally_unique_identifier) (v4): string of 32 random hexadecimal digits.
They are stored encrypted in the database using [MD5](https://en.wikipedia.org/wiki/MD5) hash function. MD5 is known to be vulnerable, but it is perfectly safe to use it on long strings of random characters. Therefore, there is no need to overload the server CPU with more complex hashing algorithms.

Users have two types of tokens:
- **session-tokens**: for website usage. A new token is created on login and is deleted on logout. It is stored in the client cookies and used for requests with authentication. This process is completely transparent for the user.
- **persistent-tokens**: for script usage. The user can create as many persistent-tokens as he wants on the [profile](http://10.0.160.147:8000/profile.html) page. All of them have a name and an expiration date of one year. The user must store these tokens in local files on his PC. In fact, they are stored encrypted on the database, so it won't be possible to access their original form after creation.

#### Expiration

Tokens expiration dates are checked when the user logs in. If the date is passed, then the token is removed from the list and therefore can no longer be used.

## Python library

### Purpose

Libastr is a **Python3** library designed to ease python scripting with A.S.T.R. API. It includes multiple features like retrieving tests, downloading archives, upload new test archives, etc.

### Installation

1. Download [lib-python-astr](https://gitlab.aldebaran.lan/hardware-test/astr/tree/master/lib-python-astr) on your computer.

2. Pip install the library in a virtualenv:

- Create a virtual environment with [virtualenvwrapper](http://virtualenvwrapper.readthedocs.io/en/latest/)
```
mkvirtualenv libastr
```

- Switch to this environment (use `which python` to see the current environment)
```
workon libastr
```

- Go to the lib-python-astr folder
```
cd lib-python-astr
```

- Install the library (libastr should appear in `pip list`)
```
pip install .
```

### Configuration

libastr needs the following environment variables.

```
export LIBASTR_URL='http://10.0.160.147:8000'
export LIBASTR_EMAIL='john.doe@softbankrobotics.com'
export LIBASTR_TOKEN='b4b71bf6-a3dd-4975-85b8-03de05096fc0'
```


### Basic usage

```python
from libastr import Astr

astr = Astr()

# retrieve archived tests
print(astr.test.get_by_args(author="John DOE",
                            type="MOTOR CONTROL",
                            configuration={"robot_type": "PEPPER"}))

# download an archive
astr.test.download_by_id(id="5b2a1e131dba23124f2962fe",
                         path="/home/john.doe/Desktop")
```

## API endpoints

#### Tests

1. [/api/tests](http://10.0.160.147:8000/api/tests)
    - GET: Returns the list of all tests (sorted by creation date in descending order)
    - POST: Returns the list of tests that match with the parameters given in the body request (sorted by creation date in descending order)
2. [/api/tests/page/:page/:resultPerPage](http://10.0.160.147:8000/api/tests/page/2/30)
    - POST: Returns the list of tests that match with the parameters given in the body request, with pagination (sorted by creation date in descending order)
3. [/api/tests/add](http://10.0.160.147:8000/api/tests/add)
    - POST: Add a new test in the DB in function of the parameters given in the body request **(user must have write permission)**
4. [/api/tests/id/:id](http://10.0.160.147:8000/api/tests/id/5adf356dda64c157e53c6b18)
    - GET: Returns the test with the associated ID
    - POST: Update the test with the associated ID in function of the parameters given in the body request (only the date, the comments, and the configuration values can be updated) **(user must be master or owner of the test)**
    - DELETE: Delete the test with the associated ID **(user must be master or owner of the test)**
5. [/api/tests/authors](http://10.0.160.147:8000/api/tests/authors)
    - GET: Returns the list of test authors (that wrote at least one test)
6. [/api/tests/subjects](http://10.0.160.147:8000/api/tests/subjects)
    - GET: Returns the list of test subjects (used at least by one test)
7. [/api/tests/configurations](http://10.0.160.147:8000/api/tests/configurations)
    - GET: Returns the list of configurations (used at least by one test)
8. [/api/tests/configurations/:subject](http://10.0.160.147:8000/api/tests/configurations/CAMERA)
    - GET: Returns the list of configurations of the associated subject (used at least by one test)
9. [/api/tests/options/:configName](http://10.0.160.147:8000/api/tests/options/robot_type)
    - GET: Returns the  options of the associated configuration (used at least one time)
10. [/api/tests/changeTestSubjectName](http://10.0.160.147:8000/api/tests/changeTestSubjectName)
    - POST: Change the test type of all the tests matched by {type: previousName} (body contains *previousName* and *newName*) **(user must be master)**
11. [/api/tests/addConfig](http://10.0.160.147:8000/api/tests/addConfig)
    - POST: Push a new configuration in all tests matched by the test type/subject (body contains *subject* and *config: {name, value}*) **(user must be master)**
12. [/api/tests/changeConfigName](http://10.0.160.147:8000/api/tests/changeConfigName)
    - POST: Change the name of the matched configuration in all tests matched by the test type/subject (body contains *subject*, *previousName* and *newName*) **(user must be master)**
13. [/api/tests/withoutArchive](http://10.0.160.147:8000/api/tests/withoutArchive)
    - GET: Returns the list of all tests without any archive (to delete them)
14. [/api/tests/YAMLformat/id/:id](http://10.0.160.147:8000/api/tests/YAMLformat/id/:id)
    - GET: Returns the test with the associated ID in a YAML format, to store it in the archive

#### Test subjects

1. [/api/test-subjects](http://10.0.160.147:8000/api/test-subjects)
    - GET: Returns the list of all test subjects
    - POST:  Add a new test subject in the DB in function of the parameters given in the body request **(user must be master)**
2. [/api/test-subjects/id/:id](http://10.0.160.147:8000/api/test-subjects/id/5adf3559da64c157e53c6b17)
    - GET: Returns the test subject with the associated ID
    - POST:  Update the test subject with the associated ID in function of the parameters given in the body request **(user must be master)**
    - DELETE: Delete the test subject with the associated ID **(user must be master)**
3. [/api/test-subjects/name/:name](http://10.0.160.147:8000/api/test-subjects/name/CAMERA)
    - GET: Returns the test subject with the associated name
4. [/api/test-subjects/options/:subject/:configName](http://10.0.160.147:8000/api/test-subjects/options/WIFI/robot_type)
    - GET: Returns the options of a configuration
4. [/api/test-subjects/links/:subject](http://10.0.160.147:8000/api/test-subjects/links/:subject)
    - GET: Returns the links of a test subject

#### Search

1. [/api/search](http://10.0.160.147:8000/api/search)
    - GET: Returns the list of all saved searches
    - POST:  Add a new search in the DB in function of the parameters given in the body request **(user must use authentification)**
2. [/api/search/id/:id](http://10.0.160.147:8000/api/search/id/5adf3559da64c157e53c6b17)
    - GET: Returns the search with the associated ID
    - DELETE: Delete the search with the associated ID **(user must be the owner of the search)**

#### Users

1. [/api/user](http://10.0.160.147:8000/api/user)
    - GET: Returns the list of all the users
    - POST: Used for connection if the body contains *logemail* and *logpassword*; or for adding a new user if the body contains *email*, *firstname*, *lastname*, *password* and *passwordConf*
2. [/api/user/master](http://10.0.160.147:8000/api/user/master)
    - GET: Returns the list of all the masters
3. [/api/user/id/:id](http://10.0.160.147:8000/api/user/id/5ad8aad45aa7dd1b0f17e7f9)
    - GET: Returns the user with the associated ID
    - POST:  Update the user with the associated ID in function of the parameters given in the body request (only the variable *write_permission* and *master* can be modified) **(user must be master)**
    - DELETE: Delete the user with the associated ID **(user must be master)**
4. [/api/user/email/:email](http://10.0.160.147:8000/api/user/email/john.doe@softbankrobotics.com)
    - GET: Returns the user with the associated email
5. [/api/user/profile](http://10.0.160.147:8000/api/user/profile)
    - GET: Returns the information about the user logged in the machine
6. [/api/user/logout](http://10.0.160.147:8000/api/user/logout)
    - GET: Log out the user logged in the machine
7. [/api/user/newToken/:type/:name](http://10.0.160.147:8000/api/user/newToken/persistent/laptop)
    - GET: Generate a new token for the user, returns it and store it encrypted in the database (type can be 'session' or 'persistent')
7. [/api/user/deleteToken/:id](http://10.0.160.147:8000/api/user/deleteToken/5b20db9770e56a3891e64cd1)
    - DELETE: Delete the token with the associated ID

#### Upload

1. [/api/upload](http://10.0.160.147:8000/api/upload)
    - POST: Upload files to the server in a ZIP. The name of the archive is the ID of the test **(user must have write permission)**
2. [/api/upload/replace-archive](http://10.0.160.147:8000/api/upload/replace-archive)
    - POST: Replace archive with a new one **(user must have write permission)**

#### Download

1. [/api/download/id/:id](http://10.0.160.147:8000/api/download/id/5ae9bba1b87b22360cc2e70f)
    - GET: Download the archive of the test with the associated ID
2. [/api/download/multiple](http://10.0.160.147:8000/api/download/multiple)
    - POST: Download a ZIP containing the archives of multiple tests. The test IDs to download are passed in the body request.
3. [/api/download/files](http://10.0.160.147:8000/api/download/files)
    - GET: Returns the list of files in archives folder

#### Stats

1. [/api](http://10.0.160.147:8000/api)
    - GET: Returns the version of A.S.T.R.
2. [/api/stats/tests-frequency](http://10.0.160.147:8000/api/stats/tests-frequency)
    - GET: Returns a dictionnary with the number of tests archived per month
3. [/api/stats/disk-usage](http://10.0.160.147:8000/api/stats/disk-usage)
    - GET: Returns a dictionnary with the disk usage information

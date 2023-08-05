# Clinical Guideline Authoring App 🏥

## Back End API, Web Server & Database

### Overview

This application forms part of my final Disseration Project for the MSc Computer Science I am studying.

The project brief:

<div>
<i>
<strong><u>Developing an authoring platform to create and edit existing clinical guidelines.</u></strong>
<br />
<br />
As part of an ongoing research study at the School of Computing and Mathematics, we have developed a mobile device application to deliver clinical information to NHS clinicians. This MSc project aims to build a prototype clinical guideline authoring and editing platform based on existing web frameworks. The goals are to: produce a web- based application where users can utilise CRUD functions (Create, Read, Update, Delete) with exiting guideline documents; Implement multi-level user admin system; Utilise HTML, CSS, JS and other web-based languages; Test the system to ensure it meets usability guidelines; and conduct literature review/research/testing to ensure the system is efficient.
</i>
</div>

<br />
<br />
This is the Back End Web Server, Database & API which connects to the Front End user application, which can be found in the following repo: <a href="https://github.com/leekli/clinical-guideline-app-FE">Clinical Guideline Authoring App: Front End</a>.
<br /><br />
This application makes use of REST endpoints.

<hr>

### Data Exclusions

- All data is excluded from this repo, as it is commercially sensitive, subject to license agreements with <a href="https://www.nice.org.uk/">NICE</a>.

- Database name ignored, requires a .env file as part of `dotenv`.

<hr>

### Technology & Packages

- <strong>Web Server:</strong> Express.js
- <strong>Testing:</strong> Jest & Supertest
- <strong>Database:</strong> MongoDB/Mongoose

<hr>

### Scripts

<strong>To seed the database locally:</strong>

```
$ npm run seed
```

<strong>To run the application locally:</strong>

```
$ npm run dev
```

<strong>To run the two test suites individually:</strong>

```
$ npm test api
$ npm test integration
```

<hr>

### API Endpoints

There are 5 main routes and endpoints which the API can receive requests on:

- **/api**
  - GET /api: Responds with a string.
- **/api/guidelines**
  - GET /api/guidelines - Responds with all existing Guidelines
  - POST /api/guidelines - Creates a new Guldeine
  - GET /api/guidelines/:guideline_id - Responds with a single existing Guideline by ID
  - PATCH /api/guidelines/:guideline_id - Responds with an updated single existing Guideline by ID
  - DELETE /api/guidelines/:guideline_id - Deletes a single existing Guideline by ID
- **/api/users**
  - GET /api/users - Reponds with all Users
  - GET /api/users/:username - Responds with a single User by Username
- **/api/branches**
  - GET /api/branches - Reponds with all existing Branches
  - POST /api/branches - Creates a new Branch
  - GET /api/branches/:branch_name - Responds with a single existing Branch by Branch Name
  - PATCH /api/branches/:branch_name - Responds with an updated single existing Branch by Branch Name
  - DELETE /api/branches/:branch_name - Deletes a single existing Branch by Branch Name
  - PATCH /api/branches/:branch_name/addusers - Adds a new user (collaborator) to an existing Branch by Branch Name
  - PATCH /api/branches/:branch_name/addsection - Adds a new section to a Guideline within an existing Branch by Branch Name
  - PATCH /api/branches/:branch_name/lockbranch - Locks the existing Branch by Branch Name
  - PATCH /api/branches/:branch_name/unlockbranch - Unlocks the existing Branch by Branch Name
  - GET /api/branches/:branch_name/comments - Responds with all user comments associated with a Branch by Branch Name
  - POST /api/branches/:branch_name/comments - Adds a new comment to a Branch by Branch Name
- **/api/approvals**
  - GET /api/approvals - Responds with all existing Approvals
  - POST /api/approvals - Creates a new Approval
  - GET /api/approvals/:approval_name - Responds with a single existing Approval by Approval Name
  - DELETE /api/approvals/:approval_name - Deletes a single existing Approval by Approval Name

<hr>

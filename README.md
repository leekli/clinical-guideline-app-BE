# Clinical Guideline Authoring App 🏥

## Back End API, Web Server & Database

### Overview

This application forms part of my final Disseration Project for the MSc Computer Science I am studying.

The project brief:

```
Developing an authoring platform to create and edit existing clinical guidelines.

As part of an ongoing research study at the School of Computing and Mathematics, we have developed a mobile device application to deliver clinical information to NHS clinicians. This MSc project aims to build a prototype clinical guideline authoring and editing platform based on existing web frameworks. The goals are to: produce a web- based application where users can utilise CRUD functions (Create, Read, Update, Delete) with exiting guideline documents; Implement multi-level user admin system; Utilise HTML, CSS, JS and other web-based languages; Test the system to ensure it meets usability guidelines; and conduct literature review/research/testing to ensure the system is efficient.
```

This is the Back End Web Server, Database & API which connects to the Front End user application, which can be found in the following repo: <a href="https://github.com/leekli/clinical-guideline-app-FE">Clinical Guideline Authoring App: Front End</a>.

This application makes use of REST endpoints.

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

There are 5 main routes the API can take:

- /api
- /api/guidelines
- /api/users
- /api/branches
- /api/approvals

<hr>

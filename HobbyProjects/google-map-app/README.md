# Getting Started with Temprature Map App

This project includes two parts one is frontend while other is backend.

## Prerequisite

To run this project whole, you need to install or have following:

- Nodejs
- Docker
- MAPBOX_ACCESS_TOKEN:
  - To get access token you need to follow following steps:
    - Go to Mapbox.
    - Sign up for a free account if you don’t already have one and this free account will give free 50K api calls.

## Frontend - React + Typescript Application

Go in the project directory, you can run:

### Run locally

#### `npm install`

Install npm required packages

#### `npm start`

Note: Before this start server, go to the root frontend folder. Create a `.env` file and add the following required environment variable to inject in the application.

```
REACT_APP_MAPBOX_ACCESS_TOKEN=''
REACT_APP_BACKEND_API_URL=''
```

and before run `npm start` ensure backend is working perfectly on mentioned `REACT_APP_BACKEND_API_URL`.

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run format`

It ensures uniform code style across the project.

#### `npm run eject`

### Deployment with docker

Before deploying the backend application through dockerization, be ensured that you have already installed docker.

`docker compose up`

It will run the app through docker using docker componse in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it.

Note: before run the docker compose command, be assured that you have created `.env` file and add the following required environment variable mentioned in npm start locally section.

## Backend - Nodejs + Typescript Application using ExpressJs

### Run locally

#### `npm install`

Install npm required packages

#### `npm run dev`

It will run the app in the development mode.\
Open [http://localhost:5000](http://localhost:5000) to view it.

### Deployment with docker

Before deploying the backend application through dockerization, be ensured that you have already installed docker.

`docker compose up`

It will run the app through docker using docker componse in the development mode.\
Open [http://localhost:5000](http://localhost:5000) to view it.

### Structure

```
├── node_moodules
├── src: # source code
    └── controllers # list of controllers
        ├── fileController.ts
    └── middleware # middleware typescript functions to act bridge betwen controller and routes
        └── multer.ts # use multer library to filter and store json file temprary
    └── models # might contain the modals object
    └── routes # contains the various routes
        ├── fileRoutes.ts # contain the route configure with controller
    └── services # Services to use inside application controller
    └── types # Contains data types files
    └── server.ts # Main server file to list the endpoints
├── uploads # Temprary store json file
├── .gitignore # it ignore file
├── package.json # Project metadata and dependencies
├── tsconfig.json # TypeScript configuration
├── docker-compose.yml # Docker script file
├── Dockerfile # Docker script file

```

## Future scopes

Due to limitation of time and other factors, there are many improvement or addition can be made to this project to increase scope of the project. For example:

- <b>Testing</b>: In future, adding tests to test the each of the UI components using `testing-library/react`
- <b>Improve code quality</b>: In future, adding eslint to the UI components would be plus to handle many future risks.
- <b>State management</b>: In future, adding React Context API + useReducer or Redux Toolkit.
- <b>Styling library</b>: In future, add some stylish .
- To be continue...

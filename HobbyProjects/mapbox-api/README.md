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

## Frontend - React + Typescript + Sass Application

Go in the project directory, you can run:

### Run locally

#### `cd frontend`

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

#### `cd frontend`

Before deploying the backend application through dockerization, be ensured that you have already installed docker.

`docker compose up`

It will run the app through docker using docker componse in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it.

Note: before run the docker compose command, be assured that you have created `.env` file and add the following required environment variable mentioned in npm start locally section.

### Structure

```
├── node_moodules
├── src: # source code
    └── components # list of React components
        ├── Buttons.tsx
        ├── Footer.tsx
        ├── Header.tsx
        ├── Menu.tsx
        ├── ModalPopup.tsx
        ├── PopupContent.tsx
        ├── TemperatureMap.tsx
    └── Images # all media files especially image
    └── models # might contain the modals object
    └── pages # list of all the pages
    └── types # contain all the type of main object
    └── server.ts # Main server file to list the endpoints
    └── App.tsx # main app component (app entry points)
├── public # Temprary store json file
├── .gitignore # it ignore file
├── package.json # Project metadata and dependencies
├── tsconfig.json # TypeScript configuration
├── docker-compose.yml # Docker script file
├── Dockerfile # Docker script file
├── .prettierrc # prettier rc file
├── .prettierignore # prettier ignore code file
```

## Backend - Nodejs + Typescript Application using ExpressJs

### Run locally

#### `cd backend`

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
    └── services # services to use inside application controller
    └── types # contains data types files
    └── server.ts # main server file to list the endpoints
├── uploads # Temprary store json file
├── .gitignore # it ignore file
├── package.json #pProject metadata and dependencies
├── tsconfig.json # TypeScript configuration
├── docker-compose.yml # Docker script file
├── Dockerfile # Docker script file

```

### Endpoints

To read the json data in uploaded json file.

The file should be in following format:

```
[{
        "city": "London",
        "lat": 51.5074,
        "lon": -0.1278,
        "temp": 12
}]
```

```
curl --location --request POST 'http://localhost:5000/api/upload'  -F "largefile=@/path/to/cities.json"

```

```
curl --location --request GET 'http://localhost:5000/api/fetch'

```

## Future scopes

Due to limitation of time and other factors, there are many improvement or addition can be made to this project to increase scope of the project. For example:

- <b>Testing</b>: In future, adding tests to test the each of the UI components using `testing-library/react`
- <b>Use single docker script file</b>: If i got a chance i can write one file to run the both docker container once.
- <b>Improve code quality</b>: In future, adding eslint to the UI components would be plus to handle many future risks.
- <b>State management</b>: In future, adding React Context API + useReducer or Redux Toolkit.
- <b>Security</b>: Add authorization to access the endpoints by AWS Access token etc.
- <b>Deploy AWS</b>: Deploy by writing cdk constructs.
- <b>Styling library</b>: In future, add some stylish .

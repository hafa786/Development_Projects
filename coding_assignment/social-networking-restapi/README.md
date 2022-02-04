## Getting Started with Social Networking RESTApi In React

Fetch and manipulate JSON data from a fictional SM Social Network REST API. Create a React application to display the data.

#### Available Scripts

In the project directory, you can run:

| command               | Description |
| -----------------     | ----------- |
| `npm i`               | It will install all the node package needed for the project.|
| `npm run build`       | It builds app package|
| `npm run start`       | Runs the app in the development mode. Open `http://localhost:3000` to view it in your browser. |
| `npm run lint`        | It will run the code and find problems in your project.
| `npm run test`        | It will run the available tests and test suits
| `npm run server`        | It will run the express api server at port 8080.
#### Project structure

```
    |-- build
    |-- documents
    |-- node_modules
    |-- public
    |-- src
        |-- components
            |-- Buttons
                |-- Buttons.module.css
                |-- Buttons.tsx
            |-- Dashboard
                |-- Dashboard.module.css
                |-- Dashboard.tsx
            |-- Inputs
                |-- Inputs.module.css
                |-- Inputs.tsx
            |-- Posts
                |-- Posts.module.css
                |-- Posts.tsx
            |-- PostStatistics
                |-- PostsStatistics.module.css
                |-- PostsStatistics.tsx
        |-- App.css
        |-- App.test.css
        |-- App.sx
        |-- declaration.d.ts
        |-- index.css
        |-- index.tsx
        |-- logo.svg
        |-- paths.ts
        |-- reportWebVital.js
        |-- setupTests.js
    |-- tsconfig.json
    |-- .eslintrc.js
    |-- package.json
    |-- config-overrides.js
    |-- declaration.d.ts
    |-- package-lock.json
    |-- README.md
    |-- server.js
```

#### Future work

There are some development which could be made in future if i will get chance:

* Improve the UI

* Express use more properly (did not implemented it here due to lack of time).

* Added the `tests` (missing in this app) using `React-testing-library`.

* Add `npm prettier` to beautify the code (good practice).

* Add `Material-UI` to make design more happy.
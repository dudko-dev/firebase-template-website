# Firebase Template

This is part of the [firebase-template project](!https://github.com/search?q=topic%3Afirebase-template+org%3Adudko-dev&type=Repositories), which consists of:

- `firebase` - firebase settings, including hosting settings and basic access rights, repo: [dudko-dev/firebase-template](https://github.com/dudko-dev/firebase-template)
- `firebase/functions` - gRPC and http cloud functions, repo: [dudko-dev/firebase-template-functions](https://github.com/dudko-dev/firebase-template-functions)
- `firebase/hosting/api` - a web portal based on react, repo: [dudko-dev/firebase-template-website](https://github.com/dudko-dev/firebase-template-website)
- `firebase/hosting/website` - web portal on js, repo: [dudko-dev/firebase-template-api](https://github.com/dudko-dev/firebase-template-api)

The project allows you to quickly deploy the basic configuration of firebase, configure the basic skeleton of cloud functions, deploy a portal on react with ready-made authorization/registration/email confirmation/password recovery methods.

just run a script:

```bash
#!/usr/bin/bash
FIREBASE_REPO="dudko-dev/firebase-template"
FIREBASE_REPO_DIR="."
FIREBASE_FUNCTIONS_REPO="dudko-dev/firebase-template-functions"
FIREBASE_FUNCTIONS_DIR="./functions"
FIREBASE_WEBSITE_REPO="dudko-dev/firebase-template-website"
FIREBASE_WEBSITE_DIR="./hosting/website"
FIREBASE_WEBAPI_REPO="dudko-dev/firebase-template-api"
FIREBASE_WEBAPI_DIR="./hosting/api"

mkdir $FIREBASE_REPO_DIR
git clone $FIREBASE_REPO $FIREBASE_REPO_DIR
mkdir $FIREBASE_FUNCTIONS_DIR
git clone $FIREBASE_FUNCTIONS_REPO $FIREBASE_FUNCTIONS_DIR
mkdir $FIREBASE_WEBSITE_DIR
git clone $FIREBASE_WEBSITE_REPO $FIREBASE_WEBSITE_DIR
mkdir $FIREBASE_WEBAPI_DIR
git clone $FIREBASE_WEBAPI_REPO $FIREBASE_WEBAPI_DIR
```

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

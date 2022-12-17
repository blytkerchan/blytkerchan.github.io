# Getting Started with Create React App

## The layout of the directories

This project was bootstrapped with the usual React thing, so `public/` contains the usual HTML assets and `src/` contains the code. The `.vscode/` directory contains some useful artifacts if you're me, but in the unlikely event you are not be, you may want to flush it and put your own VS Code configurations in there -- or get rid of it altogether.

Assuming you're future me, most of the following will be reminders.

Under `src/`, you'll find a few files that may or may not be of interest to you. Most of them you'll almost never need to touch, but the routing code for the app is in `App.js`. If you need to add new components to the app, and those components are rendered as pages, you'll need to add them there as well. Note that everyhing except `Home` is lazy-loaded, but also delay-loaded. This means that while they're only loaded when they're needed, they will also start loading as soon as the main application has rendered for the first time. This happens in parallel with downloading images, most of which are very small, so it's mostly imperceptible, but it actually speeds up UX a bit because the lazy loading isn't as visible. There are comments in the code to point you to where these need be added (and because I'm sparse with my comments, that should be enough to find them).

Aside from the few top-level files in `src/` there are a few directories.
- The `src/layout/` directory contains layouting components that basically set up the application's framework. If you want to change the layout, this is where you go.
- The `src/pages/` directory contains the pages users will interact with. These should all be referenced in the router (otherwise, how will you navigate to them?). There is one component just called `Page` in there. You can use that for generic pages that you have just text in. The text will be loaded from the i18n `pages` namespace.
- The `src/config/` directory contains the application's configuration, including menu contents.

## Internationalization (i18n)

All texts should be translated to whichever languages you know. You can do that by adding the appropriate translations to the `public/locale/*` directories. The `app` namespace (found in the app.json file) is for application-specific texts, `common` for common stuff, `pages` for text pages, and `translation` for translated phrases. Note that the i18n mechanism *will not* fall back on the `pages` namespace, but will fall back on the other ones.

To be able to run the `i18n` npm script (i.e. `npm run i18n`) you need to install `npm install -g i18next-parser`. Running the script will generate the translation files for any missing translations. You should make sure it makes no changes (i.e. `git status` shouldn't see anything after `npm run i18n`) before committing.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the unit test runner in the interactive watch mode.\
If running in CI, it will just run the test runner.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run lint`

Runs the linter on the application. Should not cause any errors.

## Some useful references

I kept these from the template because they're useful references.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)


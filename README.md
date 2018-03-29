# Web Starter Yeoman Generator [![Build Status](https://travis.ibm.com/arf/generator-web.svg?token=ePBWPJTgR2KYCeTsit1a&branch=master)](https://travis.ibm.com/arf/generator-web) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# 

Creates web project sources in an existing project directory adding boilerplate code for modern web development.

## Getting Started with a generated project

1. Run the generator and choose the options:
  `yo web`

1. Select your chosen framework: None, Angular or React

1. Select your chosen language: Swift, Node, Java, Python-Flask or Python-Django
  
1. Open `public/index.html` in your browser

## Frameworks

Frameworks are chosen using the `framework` option at the end of the generator. For example,

```
yo web --framework {None, React, AngularJS}
```

### Basic

In the basic web project, the following files are created and stored in the `public` directory:

- `public/index.html` - Basic landing page with inline CSS and encoded image assets
- `public/404.html` - Basic 404 error page
- `public/500.html` - Basic 500 error page

It is important that the web server is registered to serve files in the `public` directory.

## React

- [react](https://facebook.github.io/react/) - to build user interfaces
- [webpack](https://webpack.github.io/) - bundles your JS modules
  - sass-loader 
  - css-loader
  - style-loader

Web sources for React projects are stored in the `client` directory:

- `client/index.html` and `client/index.jsx` - Landing page sources
- `client/404.html` and `client/404.jsx` (and corresponding 500 page sources) - Error page sources
- `client/default.css` - minimized stylesheet with inline encoded images

## AngularJS

Web sources for AngularJS projects are stored in the `client` directory:

- `client/index.html` and `client/component.html` - Landing page sources
- `client/404.html` and `client/500.html` - Error pages sources
- `client/default.css` - minimized stylesheet with inline encoded images
- `client/app.js` - Angular app initialization, config and routing


## Publishing Changes

In order to publish changes, you will need to fork the repository or branch off the `master` branch.

Make sure to follow the [conventional commit specification](https://conventionalcommits.org/) before contributing. To help you with commit a commit template is provide. Run `config.sh` to initialize the commit template to your `.git/config` or use [commitizen](https://www.npmjs.com/package/commitizen)

Once you are finished with your changes, run `npm test` to make sure all tests pass.

Do a pull request against `master`, make sure the build passes. A team member will review and merge your pull request.
Once merged to `master` an auto generated pull request will be created against master to update the changelog. Make sure that the CHANGELOG.md and the package.json is correct before merging the pull request. After the auto generated pull request has been merged to `master` the version will be bumped and published to Artifactory.